import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminAuth } from "@/lib/adminAuth";

export async function GET(req: Request) {
  const auth = checkAdminAuth(req);
  if (!auth.authorized) return auth.response!;

  try {
    const cinemas = await prisma.cinema.findMany({
      include: {
        halls: {
          include: {
            _count: { select: { seats: true } },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(cinemas);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch cinemas" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = checkAdminAuth(req);
  if (!auth.authorized) return auth.response!;

  try {
    const body = await req.json();
    const { name, city, address, screenName = "Auditorium 1", rows = 8, cols = 10 } = body;

    if (!name || !city || !address) {
      return NextResponse.json({ error: "Missing required cinema fields" }, { status: 400 });
    }

    // 1. Create Cinema
    const cinema = await prisma.cinema.create({
      data: {
        name,
        city,
        address,
        location: address,
      },
    });

    // 2. Create Hall
    const hall = await prisma.hall.create({
      data: {
        cinemaId: cinema.id,
        name: screenName,
        totalSeats: Number(rows) * Number(cols),
      },
    });

    // 3. Generate Seat Records (Rows A..H, Cols 1..10)
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

    // Create seats in DB
    await prisma.seat.createMany({
      data: seatsToCreate,
    });

    return NextResponse.json({ cinema, hall, seatsCreated: seatsToCreate.length }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create cinema layout" }, { status: 500 });
  }
}
