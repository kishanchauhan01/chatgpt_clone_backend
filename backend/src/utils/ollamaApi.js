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
          "You are a helpful assistant. Respond ONLY in pure Markdown format. Do not use any HTML tags such as <br>, <p>, or <div>. For line breaks, use '\\n'.",
      },
      { role, content: msg },
    ],
    stream: true,
  });
}
