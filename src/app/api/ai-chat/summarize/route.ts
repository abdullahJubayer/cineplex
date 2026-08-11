import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId query parameter required" }, { status: 400 });
  }

  try {
    const summaryRecord = await prisma.chatSummary.findFirst({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ summaryRecord });
  } catch (e: any) {
    console.error("GET ChatSummary error:", e);
    return NextResponse.json({ error: "Failed to fetch chat summary" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, messages, recommendations = [] } = body;

    if (!userId || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "userId and non-empty messages array required" }, { status: 400 });
    }

    const apiKey = process.env.OPEN_ROUTER_API_KEY?.replace(/['"\s]/g, "").trim();
    let generatedSummary = "User explored personalized cinema recommendations and genre preferences.";

    if (apiKey && apiKey !== "") {
      try {
        const conversationText = messages
          .map((m: any) => `${m.role === "user" ? "User" : "AI"}: ${m.content}`)
          .join("\n");

        const llmRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Ticketor Chat Summarizer",
          },
          body: JSON.stringify({
            model: "openai/gpt-4o-mini",
            max_tokens: 300,
            messages: [
              {
                role: "system",
                content:
                  "Summarize the following movie conversation in 2 concise sentences. Focus on liked genres, favorite movies, disliked themes, and top recommended titles.",
              },
              { role: "user", content: conversationText },
            ],
          }),
        });

        const llmData = await llmRes.json();
        const aiSummary = llmData.choices?.[0]?.message?.content;
        if (aiSummary) {
          generatedSummary = aiSummary.trim();
        }
      } catch (err) {
        console.warn("OpenRouter Summarization LLM warning:", err);
      }
    }

    // Save or update ChatSummary in Prisma DB
    const existing = await prisma.chatSummary.findFirst({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });

    let summaryRecord;
    if (existing) {
      summaryRecord = await prisma.chatSummary.update({
        where: { id: existing.id },
        data: {
          summary: generatedSummary,
          rawMessages: JSON.stringify(messages),
          rawRecommendations: JSON.stringify(recommendations),
        },
      });
    } else {
      summaryRecord = await prisma.chatSummary.create({
        data: {
          userId,
          summary: generatedSummary,
          rawMessages: JSON.stringify(messages),
          rawRecommendations: JSON.stringify(recommendations),
        },
      });
    }

    return NextResponse.json({
      success: true,
      summaryRecord,
    });
  } catch (e: any) {
    console.error("POST ChatSummary error:", e);
    return NextResponse.json({ error: e.message || "Failed to summarize chat" }, { status: 500 });
  }
}
