// app/api/ask/route.ts

import { NextRequest, NextResponse } from "next/server";
import { ChatGroq } from "@langchain/groq";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { HumanMessage } from "@langchain/core/messages";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { MemorySaver } from "@langchain/langgraph";

// Initialize model once (reuse for all agents)
const llm = new ChatGroq({
  model: "llama3-70b-8192",
  temperature: 0,
  apiKey: process.env.GROQ_API_KEY,
});

// Memory savers for each agent (to keep separate conversation state)
const legalQAMemory = new MemorySaver();
const documentMemory = new MemorySaver();
const researchMemory = new MemorySaver();

// Create agents

// 1. General legal Q&A agent (no tools)

const legalQAAgent = createReactAgent({
  llm,
  tools: [], // required even if unused
  checkpointSaver: legalQAMemory,
});

// 2. Document assistant agent (no tools or customize as needed)
const documentAgent = createReactAgent({
  llm,
  tools: [], // required even if unused
  checkpointSaver: documentMemory,
});


// 3. Research agent with search tools
const researchAgent = createReactAgent({
  llm,
  tools: [new TavilySearchResults({ maxResults: 5 })],
  checkpointSaver: researchMemory,
});

// Simple routing logic
function routeAgent(input: string) {
  const text = input.toLowerCase();

  if (text.includes("document") || text.includes("form")) {
    return documentAgent;
  }

  if (
    text.includes("law") ||
    text.includes("case") ||
    text.includes("research") ||
    text.includes("precedent")
  ) {
    return researchAgent;
  }

  return legalQAAgent;
}

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();

    const agent = routeAgent(input);

    const agentState = await agent.invoke(
      { messages: [new HumanMessage(input)] },
      { configurable: { thread_id: "family-lawyer-thread" } }
    );

    const lastMessage =
      agentState.messages[agentState.messages.length - 1]?.content ||
      "No reply from agent.";

    return NextResponse.json({ output: lastMessage });
  } catch (error) {
    console.error("Error in /api/ask:", error);
    return NextResponse.json(
      { error: "Agent failed to respond" },
      { status: 500 }
    );
  }
}
