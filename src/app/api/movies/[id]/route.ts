import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchFullTmdbMovieDataByTitle } from "@/lib/tmdb";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    let movie = await prisma.movie.findUnique({
      where: { id },
      include: {
        showtimes: {
          include: {
            cinema: true,
            hall: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: { name: true, avatarUrl: true },
            },
          },
        },
      },
    });

    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    // Auto-Enrich from TMDB if cast is a simple string or missing real actor JSON
    let isRichCast = false;
    try {
      if (movie.cast && movie.cast.startsWith("[")) {
        isRichCast = true;
      }
    } catch (e) {
      isRichCast = false;
    }

    if (!isRichCast || !movie.watchUrl) {
      const tmdbData = await fetchFullTmdbMovieDataByTitle(movie.title);
      if (tmdbData) {
        movie = await prisma.movie.update({
          where: { id },
          data: {
            cast: tmdbData.cast,
            director: tmdbData.director,
            bannerUrl: movie.bannerUrl || tmdbData.bannerUrl,
            posterUrl: movie.posterUrl || tmdbData.posterUrl,
            description: movie.description || tmdbData.description,
            watchUrl: tmdbData.trailerUrl,
          },
          include: {
            showtimes: {
              include: {
                cinema: true,
                hall: true,
              },
            },
            reviews: {
              include: {
                user: {
                  select: { name: true, avatarUrl: true },
                },
              },
            },
          },
        });
      }
    }

    return NextResponse.json(movie);
  } catch (error: any) {
    console.error("GET /api/movies/[id] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
