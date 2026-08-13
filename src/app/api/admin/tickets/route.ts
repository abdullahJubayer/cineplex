import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
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

    const now = new Date();

    const formattedBookings = bookings.map((b) => {
      const showtimeDate = new Date(b.showtime.startTime);
      const isUpcoming = showtimeDate > now;
      let seats: string[] = [];
      try {
        seats = JSON.parse(b.seatsJson);
      } catch (e) {}

      return {
        id: b.id,
        bookingNo: b.bookingNo,
        userName: b.user.name || b.user.email,
        userEmail: b.user.email,
        userAvatar: b.user.avatarUrl,
        movieTitle: b.showtime.movie.title,
        moviePoster: b.showtime.movie.posterUrl,
        cinemaName: b.showtime.cinema.name,
        hallName: b.showtime.hall.name,
        format: b.showtime.format,
        startTime: b.showtime.startTime.toISOString(),
        seats,
        totalPrice: b.totalPrice,
        status: b.status,
        qrCodeUrl: b.qrCodeUrl,
        createdAt: b.createdAt.toISOString(),
        isUpcoming,
        foodItems: b.foodItems.map((fi) => ({
          name: fi.foodItem.name,
          quantity: fi.quantity,
          price: fi.foodItem.price,
        })),
      };
    });

    return NextResponse.json(formattedBookings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
