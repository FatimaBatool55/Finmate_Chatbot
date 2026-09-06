import { StateGraph, END, Annotation } from "@langchain/langgraph";
import { groqModel } from "./groq";
import { retrieveRelevantDocs } from "./rag";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const StateAnnotation = Annotation.Root({
  userInput: Annotation<string>,
  intent: Annotation<string>,
  context: Annotation<string>,
  response: Annotation<string>,
  chatHistory: Annotation<{ role: string; content: string }[]>,
});

async function classifyIntent(state: typeof StateAnnotation.State) {
  const prompt = `Classify this user message into ONE category: "expense" (logging/tracking spending), "budget" (budget planning questions), "question" (general finance knowledge question), "goal" (savings goal related), "general" (greetings/other).

Message: "${state.userInput}"

Reply with ONLY the category word, nothing else.`;

  const result = await groqModel.invoke([new HumanMessage(prompt)]);
  const intent = result.content.toString().trim().toLowerCase();
  return { intent };
}

async function retrieveContext(state: typeof StateAnnotation.State) {
  if (state.intent === "question" || state.intent === "budget") {
    const docs = retrieveRelevantDocs(state.userInput, 2);
    return { context: docs.join("\n\n") };
  }
  return { context: "" };
}

async function generateResponse(state: typeof StateAnnotation.State) {
  const systemPrompt = `You are FinMate AI, a friendly personal finance assistant chatting in a mobile chat app.

Rules for every response:
- Keep it short: 3 to 6 sentences, or a short list of at most 5 items.
- Never use markdown tables.
- Never use emojis.
- Never use headers (no #, ##, no bold section titles).
- Use plain sentences or simple numbered/bulleted lists only when steps truly need ordering.
- Speak like a knowledgeable friend, not a report.
- If giving investment advice, end with one short line: "This is general guidance, not professional financial advice."

${state.context ? `Relevant financial knowledge to ground your answer:\n${state.context}` : ""}`;

  const messages = [
    new SystemMessage(systemPrompt),
    ...state.chatHistory.map((m) =>
      m.role === "user" ? new HumanMessage(m.content) : new SystemMessage(m.content)
    ),
    new HumanMessage(state.userInput),
  ];

  const result = await groqModel.invoke(messages);
  return { response: result.content.toString() };
}

const workflow = new StateGraph(StateAnnotation)
  .addNode("classifyIntent", classifyIntent)
  .addNode("retrieveContext", retrieveContext)
  .addNode("generateResponse", generateResponse)
  .addEdge("__start__", "classifyIntent")
  .addEdge("classifyIntent", "retrieveContext")
  .addEdge("retrieveContext", "generateResponse")
  .addEdge("generateResponse", END);

export const financeGraph = workflow.compile();