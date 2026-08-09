import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { searchTmdbMovies, importTmdbMovie } from "@/lib/tmdb";
import { checkAdminAuth } from "@/lib/adminAuth";

export async function POST(req: Request) {
  const auth = checkAdminAuth(req);
  if (!auth.authorized) return auth.response!;

  try {
    const body = await req.json();
    const { message, action, tmdbId, draftData } = body;

    const lowerMsg = (message || "").toLowerCase().trim();
    const apiKey = process.env.OPEN_ROUTER_API_KEY?.replace(/['"\s]/g, "").trim();

    // =========================================================================
    // ACTION 1: Direct TMDB Movie Import
    // =========================================================================
    if (action === "import" && tmdbId) {
      const result = await importTmdbMovie(Number(tmdbId));
      return NextResponse.json({
        type: "import_result",
        alreadyExisted: result.alreadyExisted,
        movie: result.movie,
        reply: result.alreadyExisted
          ? `🎬 "${result.movie.title}" is already in your Ticketor catalog!`
          : `🎉 Successfully imported "${result.movie.title}" into your catalog from TMDB!`,
      });
    }

    // =========================================================================
    // ACTION 2: Create Showtime Session
    // =========================================================================
    if (action === "create_showtime" || lowerMsg.includes("schedule") || lowerMsg.includes("showtime")) {
      const movies = await prisma.movie.findMany();
      const cinemas = await prisma.cinema.findMany({ include: { halls: true } });

      const targetMovieId = draftData?.movieId || movies.find((m) => lowerMsg.includes(m.title.toLowerCase()))?.id || movies[0]?.id;
      const targetCinemaId = draftData?.cinemaId || cinemas.find((c) => lowerMsg.includes(c.name.toLowerCase()) || lowerMsg.includes(c.city.toLowerCase()))?.id || cinemas[0]?.id;
      const format = draftData?.format || (lowerMsg.includes("imax") ? "IMAX 3D Laser" : lowerMsg.includes("3d") ? "Digital 3D" : "Standard");
      const basePrice = Number(draftData?.basePrice || 16.5);

      let startTimeStr = draftData?.startTime;
      if (!startTimeStr) {
        const dateObj = new Date();
        dateObj.setDate(dateObj.getDate() + 1);
        dateObj.setHours(19, 30, 0, 0);
        startTimeStr = dateObj.toISOString();
      }

      if (!draftData && (!lowerMsg.includes("at") && !lowerMsg.includes("pm") && !lowerMsg.includes("am") && !lowerMsg.includes("tomorrow"))) {
        const matchedMovie = movies.find((m) => lowerMsg.includes(m.title.toLowerCase())) || movies[0];

        return NextResponse.json({
          type: "prompt_showtime_details",
          reply: `I can schedule a showtime session for "${matchedMovie?.title || "selected movie"}". Please confirm the cinema location and start time below:`,
          draftData: {
            movieId: matchedMovie?.id,
            movieTitle: matchedMovie?.title,
            cinemaId: cinemas[0]?.id,
            format: "IMAX 3D Laser",
            basePrice: 16.5,
            startTime: startTimeStr,
          },
          availableMovies: movies.map((m) => ({ id: m.id, title: m.title })),
          availableCinemas: cinemas.map((c) => ({ id: c.id, name: c.name, city: c.city })),
        });
      }

      const selectedMovie = movies.find((m) => m.id === targetMovieId);
      const selectedCinema = cinemas.find((c) => c.id === targetCinemaId);
      const targetHallId = selectedCinema?.halls[0]?.id;

      if (!selectedMovie || !selectedCinema || !targetHallId) {
        return NextResponse.json({
          type: "chat_reply",
          reply: "I need a valid movie and cinema location to schedule a showtime. Please select from your catalog!",
        });
      }

      const start = new Date(startTimeStr);
      const durationMins = selectedMovie.durationMins || 120;
      const end = new Date(start.getTime() + (durationMins + 20) * 60 * 1000);

      const existingShowtimes = await prisma.showtime.findMany({
        where: { hallId: targetHallId },
        include: { movie: true },
      });

      const hasOverlap = existingShowtimes.some((st: any) => {
        const stStart = new Date(st.startTime);
        const stEnd = new Date(stStart.getTime() + ((st.movie?.durationMins || 120) + 20) * 60 * 1000);
        return start < stEnd && end > stStart;
      });

      if (hasOverlap) {
        return NextResponse.json({
          type: "chat_reply",
          reply: `⚠️ Overlap Warning: Screen "${selectedCinema.halls[0]?.name}" at ${selectedCinema.name} is already booked for another session during this time window. Please pick a different time!`,
        });
      }

      const showtime = await prisma.showtime.create({
        data: {
          movieId: targetMovieId,
          cinemaId: targetCinemaId,
          hallId: targetHallId,
          startTime: start,
          format,
          basePrice,
        },
        include: { movie: true, cinema: true, hall: true },
      });

      return NextResponse.json({
        type: "showtime_created",
        showtime,
        reply: `✅ Successfully scheduled showtime session for "${showtime.movie.title}" at ${showtime.cinema.name} (${showtime.format}) on ${new Date(showtime.startTime).toLocaleString()}!`,
      });
    }

    // =========================================================================
    // ACTION 3: Create Cinema & Seat Layout
    // =========================================================================
    if (action === "create_cinema" || lowerMsg.includes("create cinema") || lowerMsg.includes("add cinema") || lowerMsg.includes("seat layout")) {
      const nameMatch = message.match(/cinema\s+['"]?([^'"]+)['"]?/i) || message.match(/create\s+['"]?([^'"]+)['"]?/i);
      const cinemaName = draftData?.name || (nameMatch ? nameMatch[1] : "Ticketor Premiere Cinema");
      const city = draftData?.city || (lowerMsg.includes("brooklyn") ? "New York" : lowerMsg.includes("chicago") ? "Chicago" : lowerMsg.includes("angeles") ? "Los Angeles" : "New York");
      const address = draftData?.address || `${city} Cinema Boulevard`;
      const rows = Number(draftData?.rows || 8);
      const cols = Number(draftData?.cols || 10);

      const cinema = await prisma.cinema.create({
        data: {
          name: cinemaName,
          city,
          address,
          location: address,
        },
      });

      const hall = await prisma.hall.create({
        data: {
          cinemaId: cinema.id,
          name: "Auditorium 1 (IMAX)",
          totalSeats: rows * cols,
        },
      });

      const rowLabels = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
      const seatsToCreate = [];

      for (let r = 0; r < Math.min(rows, rowLabels.length); r++) {
        const rowName = rowLabels[r];
        for (let c = 1; c <= cols; c++) {
          let seatType = "REGULAR";
          if (r >= 3 && r <= 5) seatType = "PREMIUM";
          if (r >= 6) seatType = "VIP";

          seatsToCreate.push({
            hallId: hall.id,
            row: rowName,
            number: c,
            type: seatType,
            price: seatType === "VIP" ? 18.0 : seatType === "PREMIUM" ? 15.0 : 12.0,
          });
        }
      }

      await prisma.seat.createMany({ data: seatsToCreate });

      return NextResponse.json({
        type: "cinema_created",
        cinema,
        hall,
        seatCount: seatsToCreate.length,
        reply: `🏛️ Successfully created new venue "${cinema.name}" in ${cinema.city} with a generated ${rows}x${cols} (${seatsToCreate.length} seats) matrix layout!`,
      });
    }

    // =========================================================================
    // ACTION 4: Create Promo Code
    // =========================================================================
    if (action === "create_promo" || lowerMsg.includes("promo") || lowerMsg.includes("coupon") || lowerMsg.includes("discount")) {
      const codeMatch = message.match(/code\s+([A-Z0-9]+)/i) || message.match(/promo\s+([A-Z0-9]+)/i) || message.match(/([A-Z0-9]{4,10})/);
      const code = draftData?.code || (codeMatch ? codeMatch[1].toUpperCase() : "PROMO25");
      const discountType = draftData?.discountType || (lowerMsg.includes("$") || lowerMsg.includes("off fixed") ? "FIXED" : "PERCENTAGE");
      const amount = Number(draftData?.amount || (lowerMsg.match(/\d+/) ? lowerMsg.match(/\d+/)[0] : 20));
      const usageLimit = Number(draftData?.usageLimit || 100);

      const existing = await prisma.promoCode.findUnique({ where: { code } });
      if (existing) {
        return NextResponse.json({
          type: "chat_reply",
          reply: `⚠️ Promo code "${code}" already exists in your system! Try another code name like "${code}2026".`,
        });
      }

      const promo = await prisma.promoCode.create({
        data: {
          code,
          discountType,
          amount,
          usageLimit,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });

      return NextResponse.json({
        type: "promo_created",
        promo,
        reply: `🏷️ Created promo code "${promo.code}" offering ${promo.discountType === "PERCENTAGE" ? `${promo.amount}% OFF` : `$${promo.amount} OFF`} for up to ${promo.usageLimit} redemptions!`,
      });
    }

    // =========================================================================
    // ACTION 5: Movie Search / Add Intent (Whole Word Regex)
    // =========================================================================
    if (lowerMsg.includes("add") || lowerMsg.includes("import") || lowerMsg.includes("find") || lowerMsg.includes("search")) {
      const cleanQuery = lowerMsg
        .replace(/\b(add|import|find|search|to|catalog|my|the|movie|movies|now|showing)\b/gi, "")
        .replace(/\s+/g, " ")
        .trim();

      const queryToUse = cleanQuery.length >= 2 ? cleanQuery : message;
      const tmdbResults = await searchTmdbMovies(queryToUse);

      if (tmdbResults.length > 0) {
        return NextResponse.json({
          type: "search_results",
          results: tmdbResults.slice(0, 4),
          reply: `I searched TMDB for "${queryToUse}" and found these matches. Which one would you like to import to your Ticketor catalog?`,
        });
      }
    }

    // =========================================================================
    // OpenRouter LLM Intelligence for Natural Conversations
    // =========================================================================
    if (apiKey && apiKey !== "") {
      try {
        const moviesCount = await prisma.movie.count();
        const cinemasCount = await prisma.cinema.count();

        const llmRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Ticketor Admin Assistant",
          },
          body: JSON.stringify({
            model: "openai/gpt-4o-mini",
            max_tokens: 600,
            messages: [
              {
                role: "system",
                content: `You are the executive Admin AI Assistant for Ticketor Cineplex. You control catalog database containing ${moviesCount} movies and ${cinemasCount} cinema locations. Respond concisely with helpful insights, operational tips, or recommendations for theater managers.`,
              },
              { role: "user", content: message },
            ],
          }),
        });

        const llmData = await llmRes.json();
        const aiReply = llmData.choices?.[0]?.message?.content;
        if (aiReply) {
          return NextResponse.json({
            type: "chat_reply",
            reply: aiReply,
          });
        }
      } catch (err) {
        console.warn("OpenRouter LLM error in Admin AI Agent, using default helper:", err);
      }
    }

    // =========================================================================
    // Default Helpful Assistant Guide
    // =========================================================================
    return NextResponse.json({
      type: "chat_reply",
      reply: `Hello Admin! I'm your Full Ticketor Cineplex Operating Assistant. You can ask me to execute any admin operation:

1. 🎬 **Add Movies**: "Search Oppenheimer" or "Add Dune 2"
2. ⏰ **Schedule Showtimes**: "Schedule Dune 2 at Grand IMAX for tomorrow 8pm"
3. 🏛️ **Create Cinemas & Seats**: "Create Cinema 'Apex IMAX' with 80 seats"
4. 🏷️ **Generate Promo Codes**: "Create promo code SUMMER30 for 30% off"`,
    });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message || "Admin AI Agent error" }, { status: 500 });
  }
}
