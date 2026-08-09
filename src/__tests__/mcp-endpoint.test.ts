import { describe, it, expect } from "vitest";
import { MCP_TOOLS, executeMcpTool } from "../app/api/mcp/route";

describe("Public MCP Server Endpoint API", () => {
  it("exposes expected MCP tools", () => {
    const toolNames = MCP_TOOLS.map((t) => t.name);
    expect(toolNames).toContain("get_now_showing_movies");
    expect(toolNames).toContain("get_movie_showtimes");
    expect(toolNames).toContain("check_seat_availability");
    expect(toolNames).toContain("book_ticket_for_user");
    expect(toolNames).toContain("get_user_tickets");
  });

  it("executes get_user_tickets via MCP handler", async () => {
    const tickets = (await executeMcpTool("get_user_tickets", { userId: "usr_demo" })) as any[];
    expect(Array.isArray(tickets)).toBe(true);
    if (tickets.length > 0) {
      expect(tickets[0]).toHaveProperty("bookingNo");
      expect(tickets[0]).toHaveProperty("qrCodeUrl");
    }
  });
});
