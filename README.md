# 🧠 AI Agents Chat App

This is an AI-powered multi-agent chat application built with **Next.js**, **LangChain**, and **Groq's LLaMA 3 model**. It allows users to interact with multiple specialized agents, each capable of handling different types of queries — such as legal questions, document assistance, and web research.

---

## 🧩 Use Case

**AI Agents Chat App** is built to assist users with **family law-related** tasks and general legal inquiries by providing intelligent, role-specific support. It simulates a lightweight AI-powered assistant that can:

- 📚 Answer general family law questions (e.g., custody, separation)
- 📄 Assist with drafting or reviewing legal documents
- 🌐 Perform online legal research and surface helpful government resources

This app helps users **prepare before consulting a lawyer**, saving time and giving clarity during stressful legal situations.

---

## 🚀 Features

- 💬 Real-time chat interface with AI responses
- 🤖 Multiple agents:
  - `LegalQA`: Handles general legal inquiries
  - `Document`: Assists with document-related tasks
  - `Research`: Performs online research using the Tavily API
- 🧠 Persistent memory using LangGraph's `MemorySaver`
- 🌐 Serverless API using Next.js App Router
- 🎯 Clean, responsive UI with loading indicators and smart scroll behavior
- ❌ Friendly fallback message if the AI fails to respond

---

## 🔧 Tech Stack

- **Frontend**: React + Next.js App Router
- **LLM**: Groq (LLaMA 3 via LangChain)
- **Agents**: LangChain Agents with LangGraph
- **Tools**: TavilySearchResults for online research
- **Styling**: Tailwind CSS

---

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/ai-agents-chat.git
cd ai-agents-chat
