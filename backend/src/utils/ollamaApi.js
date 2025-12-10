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
