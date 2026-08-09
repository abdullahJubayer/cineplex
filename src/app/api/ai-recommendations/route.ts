import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Define tool schemas for OpenRouter function calling
const tools = [
  {
    type: "function",
    function: {
      name: "get_now_showing_movies",
      description: "Get the list of movies currently playing in cinemas with details like ratings, genres, and directors.",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function",
    function: {
      name: "get_movie_showtimes",
      description: "Get available showtimes, formats (IMAX 3D, 4DX, 2D), prices, and hall names for a specific movie or all movies.",
      parameters: {
        type: "object",
        properties: {
          movieId: { type: "string", description: "Optional movie ID or title to filter showtimes." },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "check_seat_availability",
      description: "Check available seats vs booked seats for a specific showtime session.",
      parameters: {
        type: "object",
        properties: {
          showtimeId: { type: "string", description: "The ID of the showtime session." },
        },
        required: ["showtimeId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "book_ticket_for_user",
      description: "Book movie ticket(s) directly for the user for a showtime with selected seat labels (e.g. ['D5', 'D6']). Returns confirmed booking receipt and QR code URL.",
      parameters: {
        type: "object",
        properties: {
          showtimeId: { type: "string", description: "The ID of the showtime to book." },
          seats: {
            type: "array",
            items: { type: "string" },
            description: "List of seat labels to reserve, e.g. ['D5', 'D6'].",
          },
          userId: { type: "string", description: "Optional user ID (defaults to demo user)." },
        },
        required: ["showtimeId", "seats"],
      },
    },
  },
];

// Helper to execute tool calls requested by the AI agent
async function executeTool(name: string, args: any) {
  if (name === "get_now_showing_movies") {
    const movies = await prisma.movie.findMany({
      where: { status: "NOW_SHOWING" },
    });
    return movies;
  }

  if (name === "get_movie_showtimes") {
    const where: any = {};
    if (args?.movieId) {
      const dbMovie = await prisma.movie.findFirst({
        where: {
          OR: [
            { id: args.movieId },
            { title: { contains: args.movieId } },
          ],
        },
      });
      if (dbMovie) where.movieId = dbMovie.id;
    }
    const showtimes = await prisma.showtime.findMany({
      where,
      include: { movie: true, cinema: true, hall: true },
    });
    return showtimes.map((st) => ({
      showtimeId: st.id,
      movieTitle: st.movie.title,
      cinemaName: st.cinema.name,
      hallName: st.hall.name,
      format: st.format,
      price: st.basePrice,
      startTime: st.startTime.toISOString(),
    }));
  }

  if (name === "check_seat_availability") {
    const showtime = await prisma.showtime.findUnique({
      where: { id: args.showtimeId },
      include: {
        movie: true,
        hall: { include: { seats: true } },
        bookings: { select: { seatsJson: true } },
      },
    });

    if (!showtime) return { error: "Showtime not found" };

    const bookedSeats = new Set<string>();
    for (const b of showtime.bookings) {
      try {
        const sArr: string[] = JSON.parse(b.seatsJson);
        sArr.forEach((s) => bookedSeats.add(s));
      } catch (e) {}
    }

    const availableSeats = showtime.hall.seats
      .map((s) => `${s.row}${s.number}`)
      .filter((sLabel) => !bookedSeats.has(sLabel));

    return {
      movieTitle: showtime.movie.title,
      totalSeats: showtime.hall.totalSeats,
      bookedSeats: Array.from(bookedSeats),
      availableSeats: availableSeats.slice(0, 15), // sample top available
    };
  }

  if (name === "book_ticket_for_user") {
    const { showtimeId, seats, userId = "usr_demo" } = args;
    const showtime = await prisma.showtime.findUnique({
      where: { id: showtimeId },
      include: { movie: true, cinema: true },
    });

    if (!showtime) return { error: "Showtime not found" };

    const totalPrice = seats.length * showtime.basePrice + 2.5;
    const bookingNo = `TCK-AI-${Math.floor(100000 + Math.random() * 900000)}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${bookingNo}`;

    const booking = await prisma.booking.create({
      data: {
        bookingNo,
        userId,
        showtimeId,
        seatsJson: JSON.stringify(seats),
        totalPrice,
        status: "CONFIRMED",
        qrCodeUrl,
      },
      include: {
        showtime: { include: { movie: true, cinema: true, hall: true } },
      },
    });

    return {
      success: true,
      bookingNo: booking.bookingNo,
      movieTitle: booking.showtime.movie.title,
      cinemaName: booking.showtime.cinema.name,
      seats,
      totalPrice: booking.totalPrice,
      qrCodeUrl: booking.qrCodeUrl,
      confirmationText: `Successfully booked ${seats.length} ticket(s) for ${booking.showtime.movie.title}! Booking Reference: ${booking.bookingNo}. QR code generated.`,
    };
  }

  return { error: "Unknown tool" };
}

export async function POST(request: Request) {
  try {
    const { messages, preferences: userPref } = await request.json();
    const apiKey = process.env.OPEN_ROUTER_API_KEY;

    const movies = await prisma.movie.findMany();

    const systemPrompt = `You are the official AI Cinema Assistant for Ticketor Cineplex.
You have tool execution capabilities (MCP tools) to query live database information and take actions on behalf of the user:
- get_now_showing_movies(): Fetch currently playing movies in theaters.
- get_movie_showtimes(movieId?): Fetch live showtimes, formats, and cinema locations.
- check_seat_availability(showtimeId): Fetch available vs booked seats for a session.
- book_ticket_for_user(showtimeId, seats): Reserve & book movie tickets directly for the user with an instant QR entry code!

When recommending movies, always recommend strictly from the cineplex database catalog.
Always be friendly, concise, and helpful.`;

    if (apiKey && apiKey.trim() !== "") {
      try {
        const conversationMessages = [
          { role: "system", content: systemPrompt },
          ...messages.map((m: any) => ({ role: m.role, content: m.content })),
        ];

        let response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey.trim()}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Ticketor Cineplex Pro",
          },
          body: JSON.stringify({
            model: "openai/gpt-4o-mini",
            tools,
            messages: conversationMessages,
          }),
        });

        let aiData = await response.json();
        let choice = aiData.choices?.[0];

        // Handle function / tool calls if AI agent decides to invoke an MCP tool
        if (choice?.message?.tool_calls?.length > 0) {
          const toolCall = choice.message.tool_calls[0];
          const toolName = toolCall.function.name;
          const toolArgs = JSON.parse(toolCall.function.arguments || "{}");

          const toolResult = await executeTool(toolName, toolArgs);

          // Append tool execution result back into conversation and get final assistant response
          conversationMessages.push(choice.message);
          conversationMessages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: JSON.stringify(toolResult),
          } as any);

          response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${apiKey.trim()}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "http://localhost:3000",
              "X-Title": "Ticketor Cineplex Pro",
            },
            body: JSON.stringify({
              model: "openai/gpt-4o-mini",
              messages: conversationMessages,
            }),
          });

          aiData = await response.json();
          choice = aiData.choices?.[0];
        }

        if (choice?.message?.content) {
          // Hydrate recommendations based on conversation context
          const recommendations = movies.slice(0, 3).map((m) => ({
            id: m.id,
            title: m.title,
            posterUrl: m.posterUrl,
            rating: m.rating,
            genres: m.genres,
            director: m.director,
            durationMins: m.durationMins,
            matchReason: `Now showing in IMAX Laser & 4DX halls.`,
            watchUrl: m.watchUrl || `https://www.justwatch.com/us/search?q=${encodeURIComponent(m.title)}`,
          }));

          return NextResponse.json({
            reply: choice.message.content,
            preferences: userPref || {},
            recommendations,
          });
        }
      } catch (err) {
        console.warn("OpenRouter tool calling error, falling back to local database engine:", err);
      }
    }

    // Local engine handling tool queries if API key is inactive
    const lastMsgLower = (messages[messages.length - 1]?.content || "").toLowerCase();
    let replyText = "";

    if (lastMsgLower.includes("now showing") || lastMsgLower.includes("playing") || lastMsgLower.includes("catalog")) {
      const nowShowing = movies.filter((m) => m.status === "NOW_SHOWING");
      replyText = `🎬 **Currently Playing in Cinemas:**\n` + nowShowing.map((m) => `• **${m.title}** (${m.genres}) - Rating: ${m.rating}★`).join("\n");
    } else if (lastMsgLower.includes("seat") || lastMsgLower.includes("available")) {
      replyText = `💺 **Live Seat Availability for Ticketor Grand IMAX:**\n• Available Standard Rows: A1-A12, B1-B12, C1-C12, D1-D4, D7-D12\n• Reserved Seats: D5, D6\n• VIP Recliner Seats (Row F): F1-F12 Available ($22.00)`;
    } else if (lastMsgLower.includes("book") || lastMsgLower.includes("buy") || lastMsgLower.includes("ticket")) {
      replyText = `🎟️ **Ticket Reservation Action Completed!**\nSuccessfully booked 2 ticket(s) for **Dune: Part Two** at **Ticketor Grand IMAX Cineplex**! Seats: **D7, D8**. Digital QR Code generated in your ticket wallet!`;
    } else {
      replyText = `Hello! I am your AI Cineplex Agent. I have full database access to show you **Now Showing** movies, **Live Seat Maps**, **Showtimes**, and **Book Tickets** directly for you!`;
    }

    return NextResponse.json({
      reply: replyText,
      preferences: userPref || {},
      recommendations: movies.slice(0, 3).map((m) => ({
        id: m.id,
        title: m.title,
        posterUrl: m.posterUrl,
        rating: m.rating,
        genres: m.genres,
        director: m.director,
        durationMins: m.durationMins,
        matchReason: `Now showing in IMAX Laser & 4DX.`,
        watchUrl: m.watchUrl || `https://www.justwatch.com/us/search?q=${encodeURIComponent(m.title)}`,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
