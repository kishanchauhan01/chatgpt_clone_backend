import { Server } from "socket.io";
import { ollamaResponseStream } from "./ollamaApi.js";
import { Chat } from "../models/chat.model.js";
import { appendChat, createNewChat } from "../controllers/chat.controller.js";
import { ApiError } from "./ApiError.js";

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

    // socket.on("test_msg", (message) => {
    //   socket.emit("test_chek", message + " # this is tested");
    //   console.log("msg sent", message);
    // });

    socket.on("user_message", async ({ message }) => {
      try {
        console.log(message.prompt);
        if (message.userId != null) {
        }
        const stream = await ollamaResponseStream("user", message.prompt);
        let fullReply = "";

        for await (const part of stream) {
          const chunk = part.message?.content || "";
          fullReply += chunk;
          // console.log(chunk);

          // send chunks to frontend
          socket.emit("model_chunk", chunk);
        }

        // send full reply
        socket.emit("model_done", fullReply);

        if (message.isNewChat && message.userId) {
          const chat = await createNewChat({ message }, fullReply);
          socket.emit("newChatId", chat._id);
        } else if (!message.isNewChat && message.chatId) {
          console.log("here");
          const updatedChat = await appendChat({ message }, fullReply);
          
        }

        // console.log(fullReply);
      } catch (error) {
        console.error("this is error:- ", error);
        socket.emit("model_error", "Stream failed");
      }
    });
  });

  return io;
};

export const getIo = () => io;
