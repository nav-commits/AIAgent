// app/api/ask/route.ts

import { NextRequest, NextResponse } from "next/server";
import { ChatGroq } from "@langchain/groq";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { HumanMessage } from "@langchain/core/messages";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { MemorySaver } from "@langchain/langgraph";

let agentMemory: MemorySaver | null = null;

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();
    // Initialize the model (Groq using LLaMA 3)
    const agentModel = new ChatGroq({
      model: "llama3-70b-8192", // or "llama3-8b-8192"
      temperature: 0,
      apiKey: process.env.GROQ_API_KEY,
    });

    const agentTools = [new TavilySearchResults({ maxResults: 3 })];

    if (!agentMemory) {
      agentMemory = new MemorySaver();
    }
    // Create the smart agent
    const agent = await createReactAgent({
      llm: agentModel,
      tools: agentTools,
      checkpointSaver: agentMemory,
    });

    // Call the agent with user input
    const agentState = await agent.invoke(
      { messages: [new HumanMessage(input)] },
      { configurable: { thread_id: "groq-thread" } }
    );

    // Extract and return the final message
    const lastMessage =
      agentState.messages[agentState.messages.length - 1]?.content ||
      "No reply.";
    console.log("Agent response:", lastMessage);
    return NextResponse.json({ output: lastMessage });
  } catch (error) {
    console.error("Error in /api/ask:", error);
    return NextResponse.json(
      { error: "Agent failed to respond" },
      { status: 500 }
    );
  }
}
