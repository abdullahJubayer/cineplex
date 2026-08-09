import { MCP_TOOLS, executeMcpTool } from "@/app/api/mcp/route";

// Server-Sent Events (SSE) stream endpoint matching mcp-remote bridge specs
export async function GET(request: Request) {
  const encoder = new TextEncoder();
  let intervalId: NodeJS.Timeout | null = null;

  const stream = new ReadableStream({
    async start(controller) {
      try {
        controller.enqueue(
          encoder.encode(`event: endpoint\ndata: /api/mcp/sse\n\n`)
        );
      } catch (e) {
        return;
      }

      // Keep-alive ping interval safely checking controller state
      intervalId = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: ping\n\n`));
        } catch (err) {
          if (intervalId) clearInterval(intervalId);
        }
      }, 15000);
    },
    cancel() {
      if (intervalId) clearInterval(intervalId);
    },
  });

  // Handle client disconnect signal safely
  request.signal?.addEventListener("abort", () => {
    if (intervalId) clearInterval(intervalId);
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { jsonrpc = "2.0", method, params, id = 1 } = body;

    // Handle MCP protocol initialization (initialize)
    if (method === "initialize") {
      return Response.json({
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: {
            tools: {},
          },
          serverInfo: {
            name: "ticketor-cineplex-mcp",
            version: "1.0.0",
          },
        },
      });
    }

    if (method === "tools/list") {
      return Response.json({
        jsonrpc: "2.0",
        id,
        result: { tools: MCP_TOOLS },
      });
    }

    if (method === "tools/call") {
      const { name, arguments: args } = params || {};
      const toolResult = await executeMcpTool(name, args);

      return Response.json({
        jsonrpc: "2.0",
        id,
        result: {
          content: [
            {
              type: "text",
              text: JSON.stringify(toolResult, null, 2),
            },
          ],
        },
      });
    }

    return Response.json({
      jsonrpc: "2.0",
      id,
      result: {},
    });
  } catch (error: any) {
    return Response.json(
      {
        jsonrpc: "2.0",
        id: null,
        error: { code: -32603, message: error.message },
      },
      { status: 500 }
    );
  }
}
