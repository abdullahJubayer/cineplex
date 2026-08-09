import { prisma } from "@/lib/prisma";

const getApiKey = () => {
  const envKey = process.env.TMDB_API_KEY?.replace(/['"\s]/g, "").trim();
  return envKey || "e092a18c6c92484738c9f41743d0f3a5";
};

export interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids?: number[];
  runtime?: number;
}

export async function searchTmdbMovies(query: string) {
  const apiKey = getApiKey();
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&include_adult=false`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`TMDB search error: ${res.statusText}`);
    const data = await res.json();
    return data.results as TmdbMovie[];
  } catch (error) {
    console.error("TMDB Search Error:", error);
    return [];
  }
}

export async function getTmdbMovieDetails(tmdbId: number) {
  const apiKey = getApiKey();
  const url = `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${apiKey}&append_to_response=credits,videos`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`TMDB details error: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error("TMDB Details Error:", error);
    return null;
  }
}

export async function fetchFullTmdbMovieDataByTitle(title: string) {
  const searchResults = await searchTmdbMovies(title);
  if (!searchResults || searchResults.length === 0) return null;

  const topMatch = searchResults[0];
  const details = await getTmdbMovieDetails(topMatch.id);
  if (!details) return null;

  const posterUrl = details.poster_path
    ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
    : "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80";

  const bannerUrl = details.backdrop_path
    ? `https://image.tmdb.org/t/p/original${details.backdrop_path}`
    : posterUrl;

  const genres = details.genres ? details.genres.map((g: any) => g.name).join(", ") : "Action";
  const director = details.credits?.crew?.find((c: any) => c.job === "Director")?.name || "Renowned Director";
  const writers = details.credits?.crew
    ?.filter((c: any) => c.department === "Writing")
    ?.slice(0, 2)
    ?.map((c: any) => c.name)
    ?.join(" - ") || "Joseph Kosinski";

  const castArray = details.credits?.cast
    ? details.credits.cast.slice(0, 6).map((c: any) => ({
        name: c.name,
        role: c.character || "Lead Character",
        img: c.profile_path
          ? `https://image.tmdb.org/t/p/w185${c.profile_path}`
          : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      }))
    : [];

  const trailerKey = details.videos?.results?.find(
    (v: any) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
  )?.key;

  const trailerUrl = trailerKey
    ? `https://www.youtube.com/embed/${trailerKey}?autoplay=1`
    : "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1";

  return {
    title: details.title,
    tagline: details.tagline || details.overview?.slice(0, 80) || "Experience it in theaters",
    description: details.overview || "No synopsis available.",
    posterUrl,
    bannerUrl,
    durationMins: details.runtime || 120,
    rating: details.vote_average ? Number(details.vote_average.toFixed(1)) : 8.5,
    ageRating: details.adult ? "R" : "PG-13",
    releaseDate: details.release_date ? new Date(details.release_date) : new Date(),
    genres,
    director,
    writers,
    cast: JSON.stringify(castArray),
    trailerUrl,
  };
}

export async function importTmdbMovie(tmdbId: number, customStatus: string = "NOW_SHOWING") {
  const details = await getTmdbMovieDetails(tmdbId);
  if (!details) throw new Error("Could not fetch TMDB movie details.");

  const posterUrl = details.poster_path
    ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
    : "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80";

  const bannerUrl = details.backdrop_path
    ? `https://image.tmdb.org/t/p/original${details.backdrop_path}`
    : posterUrl;

  const genres = details.genres ? details.genres.map((g: any) => g.name).join(", ") : "Action";
  const director = details.credits?.crew?.find((c: any) => c.job === "Director")?.name || "Renowned Director";

  const castArray = details.credits?.cast
    ? details.credits.cast.slice(0, 6).map((c: any) => ({
        name: c.name,
        role: c.character || "Lead Character",
        img: c.profile_path
          ? `https://image.tmdb.org/t/p/w185${c.profile_path}`
          : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      }))
    : [];

  const trailerKey = details.videos?.results?.find(
    (v: any) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
  )?.key;

  const trailerUrl = trailerKey
    ? `https://www.youtube.com/embed/${trailerKey}?autoplay=1`
    : "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1";

  // Check if movie already exists in DB by title
  const existing = await prisma.movie.findFirst({
    where: { title: { equals: details.title } },
  });

  if (existing) {
    return { movie: existing, alreadyExisted: true };
  }

  // Create new Movie in Prisma DB
  const movie = await prisma.movie.create({
    data: {
      title: details.title,
      tagline: details.tagline || details.overview?.slice(0, 80) || "Experience it in theaters",
      description: details.overview || "No synopsis available.",
      posterUrl,
      bannerUrl,
      durationMins: details.runtime || 120,
      rating: details.vote_average ? Number(details.vote_average.toFixed(1)) : 8.5,
      ageRating: details.adult ? "R" : "PG-13",
      releaseDate: details.release_date ? new Date(details.release_date) : new Date(),
      genres,
      director,
      cast: JSON.stringify(castArray),
      watchUrl: trailerUrl,
      language: details.original_language?.toUpperCase() || "ENGLISH",
      status: customStatus,
    },
  });

  return { movie, alreadyExisted: false };
}
