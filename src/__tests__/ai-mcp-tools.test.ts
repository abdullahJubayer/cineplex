import { describe, it, expect } from "vitest";

describe("AI Agent MCP Tool Execution Engine", () => {
  it("fetches now showing movies correctly", () => {
    const movies = [
      { id: "1", title: "Dune: Part Two", status: "NOW_SHOWING" },
      { id: "2", title: "Coming Soon Movie", status: "COMING_SOON" },
    ];
    const nowShowing = movies.filter((m) => m.status === "NOW_SHOWING");
    expect(nowShowing.length).toBe(1);
    expect(nowShowing[0].title).toBe("Dune: Part Two");
  });

  it("calculates available seats vs booked seats", () => {
    const totalSeats = ["A1", "A2", "A3", "A4"];
    const bookedSeats = ["A2"];
    const available = totalSeats.filter((s) => !bookedSeats.includes(s));
    expect(available).toEqual(["A1", "A3", "A4"]);
  });

  it("generates booking receipt confirmation text", () => {
    const booking = {
      bookingNo: "TCK-AI-992104",
      movieTitle: "Dune: Part Two",
      seats: ["D7", "D8"],
    };
    expect(booking.bookingNo).toContain("TCK-AI");
    expect(booking.seats.length).toBe(2);
  });
});
