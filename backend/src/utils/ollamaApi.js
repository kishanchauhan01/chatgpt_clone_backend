import { Ollama } from "ollama";

export async function ollamaResponseStream(role, msg) {
  const ollama = new Ollama({
    host: "https://ollama.com/",
    headers: {
      Authorization: "Bearer " + process.env.OLLAMA_API_KEY,
    },
  });

  return await ollama.chat({
    model: "gpt-oss:120b",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant. Respond ONLY in pure Markdown format. No HTML tags. Use '\\n' for line breaks. Use emojis when helpful.",
      },
      { role, content: msg },
    ],
    stream: true,
  });
}

export async function titleResponse(msg) {
  const ollama = new Ollama({
    host: "https://ollama.com/",
    headers: {
      Authorization: "Bearer " + process.env.OLLAMA_API_KEY,
    },
  });

  return await ollama.chat({
    model: "gpt-oss:120b",
    messages: [
      {
        role: "system",
        content:
          "You are a title generator. Read the user's message and assistant reply, and produce ONLY a short title (max 8 words). Output only plain text, no JSON.",
      },
      {
        role: "user",
        content: `Generate a title for this conversation:\ ${msg}`,
      },
    ],
    stream: false,
  });
}
