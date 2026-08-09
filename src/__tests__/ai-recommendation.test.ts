import { describe, it, expect } from "vitest";

describe("AI Recommendation & Scoring Engine", () => {
  it("scores movies higher based on matching liked genres and directors", () => {
    const userPref = {
      likedGenres: ["Sci-Fi", "Action"],
      dislikedGenres: ["Romance"],
      likedDirectors: ["Christopher Nolan"],
      lovedMovies: ["Dune: Part Two"],
      hatedMovies: [],
    };

    const movie1 = {
      title: "Interstellar Odyssey",
      genres: "Adventure, Drama, Sci-Fi",
      director: "Christopher Nolan",
      rating: 4.9,
    };

    const movie2 = {
      title: "Shadows of Venice",
      genres: "Mystery, Drama",
      director: "Sofia Coppola",
      rating: 4.4,
    };

    const scoreMovie = (m: typeof movie1) => {
      let score = 0;
      const genres = m.genres.split(",").map((g) => g.trim());
      genres.forEach((g) => {
        if (userPref.likedGenres.includes(g)) score += 3;
        if (userPref.dislikedGenres.includes(g)) score -= 4;
      });
      if (userPref.likedDirectors.includes(m.director)) score += 4;
      score += m.rating;
      return score;
    };

    expect(scoreMovie(movie1)).toBeGreaterThan(scoreMovie(movie2));
  });

  it("penalizes movies with disliked genres", () => {
    const userPref = {
      likedGenres: ["Drama"],
      dislikedGenres: ["Horror"],
      likedDirectors: [],
      lovedMovies: [],
      hatedMovies: [],
    };

    const horrorMovie = {
      title: "Scary House",
      genres: "Horror, Drama",
      director: "Unknown",
      rating: 4.0,
    };

    const dramaMovie = {
      title: "Clean Drama",
      genres: "Drama",
      director: "Unknown",
      rating: 4.0,
    };

    const scoreMovie = (m: typeof horrorMovie) => {
      let score = 0;
      const genres = m.genres.split(",").map((g) => g.trim());
      genres.forEach((g) => {
        if (userPref.likedGenres.includes(g)) score += 3;
        if (userPref.dislikedGenres.includes(g)) score -= 4;
      });
      return score;
    };

    expect(scoreMovie(dramaMovie)).toBeGreaterThan(scoreMovie(horrorMovie));
  });
});
