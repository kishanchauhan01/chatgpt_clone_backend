import { Server } from "socket.io";
import { ollamaResponseStream } from "./ollamaApi.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("test_msg", (message) => {
      socket.emit("test_chek", message + " # this is tested");
      console.log("msg sent");
    });

    socket.on("user_message", async ({ message }) => {
      try {
        console.log(message);
        const stream = await ollamaResponseStream("user", message);
        let fullReply = "";

        for await (const part of stream) {
          const chunk = part.message?.content || "";
          fullReply += chunk;

          // send chunks to frontend
          socket.emit("model_chunk", chunk);
        }

        // send full reply
        socket.emit("model_done", fullReply);
      } catch (error) {
        console.error("this is error:- ", error);
        socket.emit("model_error", "Stream failed");
      }
    });
  });

  return io;
};

export const getIo = () => io;
