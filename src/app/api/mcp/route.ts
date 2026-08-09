import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// Define JSON-RPC 2.0 / MCP tool definitions exposed over HTTP
export const MCP_TOOLS = [
  {
    name: "get_now_showing_movies",
    description: "Get the list of movies currently playing in cinemas with ratings, genres, directors, and duration.",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "get_movie_showtimes",
    description: "Get available showtimes, formats (IMAX 3D, 4DX, 2D), prices, and hall names for a specific movie or all movies.",
    inputSchema: {
      type: "object",
      properties: {
        movieId: { type: "string", description: "Optional movie ID or title to filter showtimes." },
      },
    },
  },
  {
    name: "check_seat_availability",
    description: "Check available seats vs booked seats for a specific showtime session.",
    inputSchema: {
      type: "object",
      properties: {
        showtimeId: { type: "string", description: "The ID of the showtime session." },
      },
      required: ["showtimeId"],
    },
  },
  {
    name: "book_ticket_for_user",
    description: "Book movie ticket(s) directly for a showtime with selected seat labels (e.g. ['D5', 'D6']). Returns confirmed booking receipt and QR code URL.",
    inputSchema: {
      type: "object",
      properties: {
        showtimeId: { type: "string", description: "The ID of the showtime to book." },
        seats: {
          type: "array",
          items: { type: "string" },
          description: "List of seat labels to reserve, e.g. ['D5', 'D6'].",
        },
        userId: { type: "string", description: "Optional user ID (defaults to demo user 'usr_demo')." },
      },
      required: ["showtimeId", "seats"],
    },
  },
  {
    name: "get_user_tickets",
    description: "Retrieve digital tickets and QR entry codes booked by a user.",
    inputSchema: {
      type: "object",
      properties: {
        userId: { type: "string", description: "User ID (defaults to 'usr_demo')." },
      },
    },
  },
];

// Helper execution handler
export async function executeMcpTool(name: string, args: any) {
  if (name === "get_now_showing_movies") {
    return await prisma.movie.findMany({
      where: { status: "NOW_SHOWING" },
    });
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
      movieId: st.movieId,
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
      availableSeats: availableSeats.slice(0, 20),
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
    const bookingNo = `TCK-MCP-${Math.floor(100000 + Math.random() * 900000)}`;
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

  if (name === "get_user_tickets") {
    const userId = args?.userId || "usr_demo";
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        showtime: { include: { movie: true, cinema: true, hall: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return bookings.map((b) => ({
      bookingNo: b.bookingNo,
      movieTitle: b.showtime.movie.title,
      cinemaName: b.showtime.cinema.name,
      hallName: b.showtime.hall.name,
      format: b.showtime.format,
      seats: JSON.parse(b.seatsJson),
      totalPrice: b.totalPrice,
      status: b.status,
      qrCodeUrl: b.qrCodeUrl,
      createdAt: b.createdAt.toISOString(),
    }));
  }

  throw new Error(`Tool '${name}' not found.`);
}

// GET Endpoint: Discovery mechanism returning server metadata and available tools list
export async function GET() {
  return NextResponse.json({
    name: "ticketor-cineplex-mcp",
    version: "1.0.0",
    description: "Ticketor Cineplex MCP Server for External AI Agents & Assistants",
    protocol: "mcp/1.0",
    endpoints: {
      mcp: "/api/mcp",
      sse: "/api/mcp/sse",
    },
    tools: MCP_TOOLS,
  });
}

// POST Endpoint: JSON-RPC 2.0 Protocol Handler for External MCP Clients & Agents
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { jsonrpc = "2.0", method, params, id = 1 } = body;

    // Handle tool list discovery (tools/list)
    if (method === "tools/list") {
      return NextResponse.json({
        jsonrpc: "2.0",
        id,
        result: {
          tools: MCP_TOOLS,
        },
      });
    }

    // Handle tool execution call (tools/call)
    if (method === "tools/call") {
      const { name, arguments: args } = params || {};
      const toolResult = await executeMcpTool(name, args);

      return NextResponse.json({
        jsonrpc: "2.0",
        id,
        result: {
          content: [
            {
              type: "text",
              text: JSON.stringify(toolResult, null, 2),
            },
          ],
        },
      });
    }

    // Handle ping check
    if (method === "ping") {
      return NextResponse.json({
        jsonrpc: "2.0",
        id,
        result: {},
      });
    }

    return NextResponse.json(
      {
        jsonrpc: "2.0",
        id,
        error: {
          code: -32601,
          message: `Method '${method}' not supported. Supported methods: 'tools/list', 'tools/call', 'ping'.`,
        },
      },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        jsonrpc: "2.0",
        id: null,
        error: {
          code: -32603,
          message: error.message || "Internal server error",
        },
      },
      { status: 500 }
    );
  }
}
