# 🍿 Ticketor Cineplex MCP Server Config

To connect your **Ticketor Cineplex application** to any external agent (Cursor, Claude Desktop, Antigravity, VS Code, etc.) using `npx mcp-remote` (similar to Figma's dev mode remote connection):

### Add this block to your MCP config file (`mcp_config.json` or `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "cineplex-mcp-server": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "http://127.0.0.1:3000/api/mcp/sse"
      ]
    }
  }
}
```

---

## ⚡ How It Works

1. Start your application:
   ```bash
   npm run dev
   ```
2. Your app serves the live SSE bridge endpoint at `http://127.0.0.1:3000/api/mcp/sse`.
3. `npx mcp-remote` connects to your local app, exposes all 5 cinema tools (`get_now_showing_movies`, `get_movie_showtimes`, `check_seat_availability`, `book_ticket_for_user`, `get_user_tickets`), and allows any external agent to book tickets and query live seat maps!
