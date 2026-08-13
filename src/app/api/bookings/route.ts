import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, showtimeId, seats, foodItems, totalPrice } = body;

    if (!showtimeId || !seats || !Array.isArray(seats) || seats.length === 0) {
      return NextResponse.json(
        { error: "Showtime and seats are required." },
        { status: 400 }
      );
    }

    // Check seat availability
    const existingBookings = await prisma.booking.findMany({
      where: { showtimeId, status: "CONFIRMED" },
      select: { seatsJson: true },
    });

    const alreadyBooked = new Set<string>();
    for (const b of existingBookings) {
      try {
        const sArr: string[] = JSON.parse(b.seatsJson);
        sArr.forEach((s) => alreadyBooked.add(s));
      } catch (e) {}
    }

    const conflict = seats.find((s: string) => alreadyBooked.has(s));
    if (conflict) {
      return NextResponse.json(
        { error: `Seat ${conflict} is already booked. Please pick another seat.` },
        { status: 409 }
      );
    }

    // Resolve valid database user (Find or Upsert by email or ID)
    let validUser = null;
    if (userId) {
      validUser = await prisma.user.findFirst({
        where: { OR: [{ id: userId }, { email: userId }] },
      });

      if (!validUser) {
        const cleanEmail = userId.includes("@") ? userId : `${userId.replace("usr_", "")}@ticketor.com`;
        const cleanId = userId.startsWith("usr_") ? userId : `usr_${userId.replace(/[^a-zA-Z0-9]/g, "_")}`;
        
        validUser = await prisma.user.create({
          data: {
            id: cleanId,
            email: cleanEmail,
            name: cleanEmail.split("@")[0],
            password: "password123",
            isVerified: true,
          },
        });
      }
    }

    if (!validUser) {
      validUser = await prisma.user.findFirst();
    }

    if (!validUser) {
      validUser = await prisma.user.create({
        data: {
          id: "usr_demo",
          email: "alex@ticketor.com",
          name: "Alex Rivera",
          password: "password123",
          isVerified: true,
        },
      });
    }

    const bookingNo = `TCK-${Math.floor(100000 + Math.random() * 900000)}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${bookingNo}`;

    const booking = await prisma.booking.create({
      data: {
        bookingNo,
        userId: validUser.id,
        showtimeId,
        seatsJson: JSON.stringify(seats),
        totalPrice: totalPrice || 0,
        status: "CONFIRMED",
        qrCodeUrl,
        foodItems: foodItems && foodItems.length > 0
          ? {
              create: foodItems.map((item: { foodItemId: string; quantity: number }) => ({
                foodItemId: item.foodItemId,
                quantity: item.quantity,
              })),
            }
          : undefined,
      },
      include: {
        showtime: {
          include: {
            movie: true,
            cinema: true,
            hall: true,
          },
        },
        foodItems: {
          include: {
            foodItem: true,
          },
        },
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedUserId = searchParams.get("userId");
  const bookingNosParam = searchParams.get("bookingNos");

  try {
    let whereClause: any = null;

    // Case 1: Logged-in User Request (User-wise history)
    if (requestedUserId && requestedUserId.trim() !== "" && requestedUserId !== "null" && requestedUserId !== "undefined") {
      const derivedEmail = requestedUserId.includes("@")
        ? requestedUserId
        : `${requestedUserId.replace("usr_", "")}@ticketor.com`;

      const userMatches = await prisma.user.findMany({
        where: { OR: [{ id: requestedUserId }, { email: requestedUserId }, { email: derivedEmail }] },
        select: { id: true },
      });

      const userIdsToMatch = Array.from(
        new Set([requestedUserId, derivedEmail, ...userMatches.map((u) => u.id)])
      );

      whereClause = { userId: { in: userIdsToMatch } };
    } 
    // Case 2: Unauthenticated / Anonymous Session Request (Session-wise history)
    else if (bookingNosParam && bookingNosParam.trim() !== "") {
      const nosArray = bookingNosParam
        .split(",")
        .map((n) => n.trim())
        .filter((n) => n.length > 0);

      if (nosArray.length > 0) {
        whereClause = { bookingNo: { in: nosArray } };
      } else {
        return NextResponse.json([]);
      }
    } 
    // Case 3: Anonymous guest with no session bookings -> return empty array
    else {
      return NextResponse.json([]);
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        showtime: {
          include: {
            movie: true,
            cinema: true,
            hall: true,
          },
        },
        foodItems: {
          include: {
            foodItem: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(bookings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
