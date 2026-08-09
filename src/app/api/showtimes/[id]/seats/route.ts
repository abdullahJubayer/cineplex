import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const showtime = await prisma.showtime.findUnique({
      where: { id },
      include: {
        movie: true,
        cinema: true,
        hall: {
          include: {
            seats: true,
          },
        },
        bookings: {
          select: {
            seatsJson: true,
          },
        },
      },
    });

    if (!showtime) {
      return NextResponse.json({ error: "Showtime not found" }, { status: 404 });
    }

    // Calculate booked seats
    const bookedSeats = new Set<string>();
    for (const b of showtime.bookings) {
      try {
        const seats: string[] = JSON.parse(b.seatsJson);
        seats.forEach((s) => bookedSeats.add(s));
      } catch (e) {
        // ignore JSON parse error
      }
    }

    return NextResponse.json({
      ...showtime,
      bookedSeats: Array.from(bookedSeats),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
