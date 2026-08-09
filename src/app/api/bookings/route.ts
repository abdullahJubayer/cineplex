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

    const bookingNo = `TCK-${Math.floor(100000 + Math.random() * 900000)}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${bookingNo}`;

    const booking = await prisma.booking.create({
      data: {
        bookingNo,
        userId: userId || "usr_demo",
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
  const userId = searchParams.get("userId") || "usr_demo";

  try {
    const bookings = await prisma.booking.findMany({
      where: { userId },
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
