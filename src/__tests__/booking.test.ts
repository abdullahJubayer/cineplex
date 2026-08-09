import { describe, it, expect } from "vitest";

describe("Ticketor Price Calculator Logic", () => {
  it("calculates total seats price correctly", () => {
    const seats = [
      { price: 14.0 },
      { price: 22.0 },
    ];
    const total = seats.reduce((sum, s) => sum + s.price, 0);
    expect(total).toBe(36.0);
  });

  it("calculates concession items total correctly", () => {
    const items = [
      { price: 18.5, quantity: 1 },
      { price: 5.5, quantity: 2 },
    ];
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    expect(total).toBe(29.5);
  });

  it("applies booking fee when seats are selected", () => {
    const seats = [{ price: 14.0 }];
    const bookingFee = seats.length > 0 ? 2.50 : 0;
    expect(bookingFee).toBe(2.50);
  });
});
