import { PrismaClient } from "@prisma/client";
import { importTmdbMovie } from "../src/lib/tmdb";

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Clearing old database & wiping dummy data...");

  // Clean all existing tables
  await prisma.bookingFood.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.seat.deleteMany({});
  await prisma.showtime.deleteMany({});
  await prisma.hall.deleteMany({});
  await prisma.cinema.deleteMany({});
  await prisma.foodItem.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.promoCode.deleteMany({});
  await prisma.movie.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("👤 Creating demo admin user...");
  const user = await prisma.user.create({
    data: {
      id: "usr_demo",
      email: "alex@ticketor.com",
      name: "Alex Rivera",
      password: "password123",
      isVerified: true,
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    },
  });

  console.log("🎬 Importing top 5 latest blockbuster movies from TMDB with real actor photos & trailers...");

  // Top 5 latest TMDB movies:
  // 1. Gladiator II (558449)
  // 2. Dune: Part Two (693134)
  // 3. Deadpool & Wolverine (533535)
  // 4. Inside Out 2 (1022789)
  // 5. Oppenheimer (872585)
  const tmdbIds = [558449, 693134, 533535, 1022789, 872585];
  const importedMovies = [];

  for (const id of tmdbIds) {
    try {
      const res = await importTmdbMovie(id, "NOW_SHOWING");
      importedMovies.push(res.movie);
      console.log(`  ✓ Imported "${res.movie.title}"`);
    } catch (e: any) {
      console.error(`  ✕ Error importing TMDB ID ${id}:`, e.message);
    }
  }

  console.log("🏛️ Creating cinemas & seat matrix layouts...");
  const cinema1 = await prisma.cinema.create({
    data: {
      id: "cin_grand",
      name: "Ticketor Grand IMAX Cineplex",
      location: "Downtown Plaza",
      address: "100 Grand Avenue, Suite 400",
      city: "New York",
    },
  });

  const cinema2 = await prisma.cinema.create({
    data: {
      id: "cin_starlight",
      name: "Starlight Dolby Cinema",
      location: "Sunset Boulevard",
      address: "7500 Sunset Blvd",
      city: "Los Angeles",
    },
  });

  const hall1 = await prisma.hall.create({
    data: {
      id: "hall_imax_1",
      name: "IMAX Laser Hall 1",
      cinemaId: cinema1.id,
      totalSeats: 72,
    },
  });

  const hall2 = await prisma.hall.create({
    data: {
      id: "hall_dolby_2",
      name: "Dolby Atmos Hall 2",
      cinemaId: cinema2.id,
      totalSeats: 72,
    },
  });

  // Create Seats for Hall 1 & Hall 2
  const rows = ["A", "B", "C", "D", "E", "F"];
  for (const hallId of [hall1.id, hall2.id]) {
    for (const r of rows) {
      for (let num = 1; num <= 12; num++) {
        const type = r === "F" ? "VIP" : r === "E" ? "COUPLE" : "STANDARD";
        const price = type === "VIP" ? 22 : type === "COUPLE" ? 18 : 14;
        await prisma.seat.create({
          data: {
            hallId,
            row: r,
            number: num,
            type,
            price,
          },
        });
      }
    }
  }

  console.log("⏰ Creating showtime sessions for ALL imported movies...");
  const formats = ["IMAX 3D Laser", "Dolby Atmos", "Digital 3D", "Standard"];
  const halls = [hall1, hall2];

  for (let idx = 0; idx < importedMovies.length; idx++) {
    const movie = importedMovies[idx];
    const targetHall = halls[idx % halls.length];
    const targetCinemaId = targetHall.cinemaId;

    const startTime = new Date();
    startTime.setDate(startTime.getDate() + (idx % 3) + 1);
    startTime.setHours(14 + (idx * 2) % 8, 30, 0, 0);

    await prisma.showtime.create({
      data: {
        id: `st_seed_${movie.id.slice(0, 8)}`,
        movieId: movie.id,
        cinemaId: targetCinemaId,
        hallId: targetHall.id,
        startTime,
        format: formats[idx % formats.length],
        basePrice: 16.5 + (idx % 3) * 2,
      },
    });

    console.log(`  ✓ Scheduled showtime for "${movie.title}" on ${startTime.toLocaleString()}`);
  }

  console.log("🍿 Creating food menu items & promo codes...");
  await prisma.foodItem.createMany({
    data: [
      {
        id: "food_combo1",
        name: "Ultimate Movie Combo",
        description: "1 Large Caramel Popcorn + 2 Large Sodas + 1 Nachos",
        price: 18.5,
        category: "COMBO",
        imageUrl: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=300&q=80",
      },
      {
        id: "food_popcorn",
        name: "Butter Caramel Popcorn (XL)",
        description: "Freshly popped gourmet corn smothered in hot butter and caramel glaze.",
        price: 9.0,
        category: "POPCORN",
        imageUrl: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=300&q=80",
      },
    ],
  });

  await prisma.promoCode.create({
    data: {
      code: "SUMMER30",
      discountType: "PERCENTAGE",
      amount: 30,
      usageLimit: 100,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  console.log("🎉 Database refreshed cleanly with showtimes for ALL 5 TMDB movies!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
