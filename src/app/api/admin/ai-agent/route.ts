import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { searchTmdbMovies, importTmdbMovie } from "@/lib/tmdb";
import { checkAdminAuth } from "@/lib/adminAuth";
import { AI_AGENT_CONFIG } from "@/lib/ai-config";

export async function POST(req: Request) {
  const auth = checkAdminAuth(req);
  if (!auth.authorized) return auth.response!;

  try {
    const body = await req.json();
    const { message, action, tmdbId, draftData, history } = body;

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
    // Fetch Catalog Context for Contextual Intelligence
    // =========================================================================
    const movies = await prisma.movie.findMany();
    const cinemas = await prisma.cinema.findMany({ include: { halls: true } });

    // Check if the user is asking to schedule showtimes or add showtimes
    const isScheduleIntent =
      action === "create_showtime" ||
      lowerMsg.includes("schedule") ||
      lowerMsg.includes("showtime") ||
      lowerMsg.includes("session") ||
      lowerMsg.includes("evening") ||
      lowerMsg.includes("morning") ||
      lowerMsg.includes("afternoon") ||
      lowerMsg.includes("pm") ||
      lowerMsg.includes("am");

    // =========================================================================
    // ACTION 2: Create Showtime Session (With Context Preservation)
    // =========================================================================
    if (isScheduleIntent && !lowerMsg.startsWith("add ") && !lowerMsg.startsWith("search ") && !lowerMsg.startsWith("import ")) {
      // Find movie referenced in history or current message
      let targetMovie = draftData?.movieId
        ? movies.find((m) => m.id === draftData.movieId)
        : null;

      if (!targetMovie) {
        // Search current message first
        targetMovie = movies.find((m) => lowerMsg.includes(m.title.toLowerCase()));
      }

      if (!targetMovie && Array.isArray(history)) {
        // Search conversation history from recent to oldest for referenced movie
        for (let i = history.length - 1; i >= 0; i--) {
          const histText = (history[i]?.text || "").toLowerCase();
          const found = movies.find((m) => histText.includes(m.title.toLowerCase()));
          if (found) {
            targetMovie = found;
            break;
          }
        }
      }

      // If no movie match found in DB catalog, default to first catalog movie
      if (!targetMovie) {
        targetMovie = movies[0];
      }

      const targetCinemaId =
        draftData?.cinemaId ||
        cinemas.find((c) => lowerMsg.includes(c.name.toLowerCase()) || lowerMsg.includes(c.city.toLowerCase()))?.id ||
        cinemas[0]?.id;

      const format =
        draftData?.format ||
        (lowerMsg.includes("imax") ? "IMAX 3D Laser" : lowerMsg.includes("3d") ? "Digital 3D" : "Standard");
      const basePrice = Number(draftData?.basePrice || 16.5);

      let startTimeStr = draftData?.startTime;
      if (!startTimeStr) {
        const dateObj = new Date();
        dateObj.setDate(dateObj.getDate() + 1);

        // Adjust hours based on time slot keywords
        if (lowerMsg.includes("evening") || lowerMsg.includes("night")) {
          dateObj.setHours(19, 30, 0, 0);
        } else if (lowerMsg.includes("morning")) {
          dateObj.setHours(10, 30, 0, 0);
        } else if (lowerMsg.includes("afternoon")) {
          dateObj.setHours(14, 30, 0, 0);
        } else {
          dateObj.setHours(19, 30, 0, 0);
        }
        startTimeStr = dateObj.toISOString();
      }

      // If user hasn't explicitly clicked confirm button, render confirmation slot-filling UI card
      if (action !== "create_showtime" && !draftData) {
        return NextResponse.json({
          type: "prompt_showtime_details",
          reply: `I can schedule a showtime session for "${targetMovie?.title || "selected movie"}". Please review or confirm the cinema location and start time below:`,
          draftData: {
            movieId: targetMovie?.id,
            movieTitle: targetMovie?.title,
            cinemaId: targetCinemaId,
            format,
            basePrice,
            startTime: startTimeStr,
          },
          availableMovies: movies.map((m) => ({ id: m.id, title: m.title })),
          availableCinemas: cinemas.map((c) => ({ id: c.id, name: c.name, city: c.city })),
        });
      }

      const selectedMovie = movies.find((m) => m.id === targetMovie?.id);
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
          movieId: selectedMovie.id,
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
    if (lowerMsg.startsWith("add ") || lowerMsg.startsWith("import ") || lowerMsg.startsWith("find ") || lowerMsg.startsWith("search ")) {
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
    // OpenRouter LLM Intelligence for Natural Conversations & Compacted History
    // =========================================================================
    if (apiKey && apiKey !== "") {
      try {
        const moviesCount = movies.length;
        const cinemasCount = cinemas.length;

        // Build compact conversation context from past history array
        const compactHistory: Array<{ role: string; content: string }> = [];
        if (Array.isArray(history)) {
          // Take recent turns (up to last 6 messages) to prevent context drift
          const recent = history.slice(-6);
          recent.forEach((item: any) => {
            if (item.text) {
              compactHistory.push({
                role: item.sender === "user" ? "user" : "assistant",
                content: item.text,
              });
            }
          });
        }

        const systemPrompt = AI_AGENT_CONFIG.adminAgent.systemPrompt(
          moviesCount,
          cinemasCount,
          movies.map((m) => m.title),
          cinemas.map((c) => `${c.name} (${c.city})`)
        );

        const llmRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Ticketor Admin Assistant",
          },
          body: JSON.stringify({
            model: AI_AGENT_CONFIG.model,
            max_tokens: 600,
            messages: [
              { role: "system", content: systemPrompt },
              ...compactHistory,
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
      reply: AI_AGENT_CONFIG.adminAgent.welcomeMessage,
    });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message || "Admin AI Agent error" }, { status: 500 });
  }
}
