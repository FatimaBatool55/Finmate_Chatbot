import { NextRequest, NextResponse } from "next/server";
import { financeGraph } from "@/lib/graph";

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const result = await financeGraph.invoke({
      userInput: message,
      chatHistory: history || [],
      intent: "",
      context: "",
      response: "",
    });

    return NextResponse.json({
      response: result.response,
      intent: result.intent,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}