import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with legal watch URLs...");

  // Clean existing data
  await prisma.bookingFood.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.seat.deleteMany({});
  await prisma.showtime.deleteMany({});
  await prisma.hall.deleteMany({});
  await prisma.cinema.deleteMany({});
  await prisma.foodItem.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.movie.deleteMany({});
  await prisma.user.deleteMany({});

  // Seed User
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

  // Seed Movies with watchUrl
  const movie1 = await prisma.movie.create({
    data: {
      id: "mov_dune2",
      title: "Dune: Part Two",
      tagline: "Long live the fighters.",
      description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
      posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1440&q=80",
      durationMins: 166,
      rating: 4.8,
      ageRating: "PG-13",
      releaseDate: new Date("2026-03-01"),
      genres: "Action, Adventure, Sci-Fi",
      director: "Denis Villeneuve",
      cast: "Timothée Chalamet, Zendaya, Rebecca Ferguson",
      language: "English",
      status: "NOW_SHOWING",
      watchUrl: "https://www.max.com/movies/dune-part-two",
    },
  });

  const movie2 = await prisma.movie.create({
    data: {
      id: "mov_cyber",
      title: "Cyber Neon 2088",
      tagline: "Future has no rules.",
      description: "In a dystopian cyberpunk city, a rogue hacker unravels a corporate conspiracy threatening human consciousness.",
      posterUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1440&q=80",
      durationMins: 142,
      rating: 4.6,
      ageRating: "R",
      releaseDate: new Date("2026-04-15"),
      genres: "Sci-Fi, Action, Thriller",
      director: "Marcus Vance",
      cast: "Keanu Reeves, Ana de Armas",
      language: "English",
      status: "NOW_SHOWING",
      watchUrl: "https://www.netflix.com/title/cyber-neon-2088",
    },
  });

  const movie3 = await prisma.movie.create({
    data: {
      id: "mov_stellar",
      title: "Interstellar Odyssey",
      tagline: "Beyond the stars lies home.",
      description: "Explorers travel through a newly discovered wormhole in search of a new home for mankind.",
      posterUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1440&q=80",
      durationMins: 155,
      rating: 4.9,
      ageRating: "PG-13",
      releaseDate: new Date("2026-05-10"),
      genres: "Adventure, Drama, Sci-Fi",
      director: "Christopher Nolan",
      cast: "Matthew McConaughey, Anne Hathaway",
      language: "English",
      status: "NOW_SHOWING",
      watchUrl: "https://www.paramountplus.com/movies/interstellar",
    },
  });

  const movie4 = await prisma.movie.create({
    data: {
      id: "mov_shadow",
      title: "Shadows of Venice",
      tagline: "Every secret leaves a reflection.",
      description: "A mysterious detective navigates the dark canals of Venice to solve a centuries-old art heist.",
      posterUrl: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=600&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1440&q=80",
      durationMins: 128,
      rating: 4.4,
      ageRating: "PG-13",
      releaseDate: new Date("2026-09-01"),
      genres: "Mystery, Drama",
      director: "Sofia Coppola",
      cast: "Florence Pugh, Oscar Isaac",
      language: "English",
      status: "COMING_SOON",
      watchUrl: "https://tv.apple.com/us/movie/shadows-of-venice",
    },
  });

  const movie5 = await prisma.movie.create({
    data: {
      id: "mov_dark_knight",
      title: "The Dark Knight",
      tagline: "Welcome to a world without rules.",
      description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
      posterUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1440&q=80",
      durationMins: 152,
      rating: 4.9,
      ageRating: "PG-13",
      releaseDate: new Date("2008-07-18"),
      genres: "Action, Crime, Drama",
      director: "Christopher Nolan",
      cast: "Christian Bale, Heath Ledger, Aaron Eckhart",
      language: "English",
      status: "NOW_SHOWING",
      watchUrl: "https://www.max.com/movies/the-dark-knight",
    },
  });

  const movie6 = await prisma.movie.create({
    data: {
      id: "mov_inception",
      title: "Inception",
      tagline: "Your mind is the scene of the crime.",
      description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
      posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1440&q=80",
      durationMins: 148,
      rating: 4.8,
      ageRating: "PG-13",
      releaseDate: new Date("2010-07-16"),
      genres: "Action, Adventure, Sci-Fi",
      director: "Christopher Nolan",
      cast: "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page",
      language: "English",
      status: "NOW_SHOWING",
      watchUrl: "https://www.netflix.com/title/inception",
    },
  });

  // Seed Cinemas & Halls
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
      cinemaId: cinema1.id,
      totalSeats: 72,
    },
  });

  // Create Seats for Hall 1
  const rows = ["A", "B", "C", "D", "E", "F"];
  for (const r of rows) {
    for (let num = 1; num <= 12; num++) {
      const type = r === "F" ? "VIP" : r === "E" ? "COUPLE" : "STANDARD";
      const price = type === "VIP" ? 22 : type === "COUPLE" ? 18 : 14;
      await prisma.seat.create({
        data: {
          hallId: hall1.id,
          row: r,
          number: num,
          type,
          price,
        },
      });
    }
  }

  // Seed Showtimes
  const showtime1 = await prisma.showtime.create({
    data: {
      id: "st_1",
      movieId: movie1.id,
      cinemaId: cinema1.id,
      hallId: hall1.id,
      startTime: new Date(Date.now() + 86400000 * 1 + 3600000 * 4),
      format: "IMAX 3D",
      basePrice: 18.0,
    },
  });

  const showtime2 = await prisma.showtime.create({
    data: {
      id: "st_2",
      movieId: movie2.id,
      cinemaId: cinema1.id,
      hallId: hall2.id,
      startTime: new Date(Date.now() + 86400000 * 1 + 3600000 * 6),
      format: "4DX",
      basePrice: 20.0,
    },
  });

  // Seed Food Items
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

  // Seed sample booking
  await prisma.booking.create({
    data: {
      id: "bk_sample1",
      bookingNo: "TCK-892401",
      userId: user.id,
      showtimeId: showtime1.id,
      seatsJson: JSON.stringify(["D5", "D6"]),
      totalPrice: 36.0,
      status: "CONFIRMED",
      qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TCK-892401",
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
