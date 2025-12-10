import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Chat } from "../models/chat.model.js";

const createNewChat = async ({ message }, LLMResponse) => {
  const { prompt, msgId, userId, chatId, isNewChat } = message;

  if (!userId) {
    throw new ApiError(404, "UserId is required");
  }

  const newChat = await Chat.create({
    chatTitle: "hi",
    userId,
    messages: [
      { id: msgId, role: "user", content: prompt },
      { role: "assistant", content: LLMResponse },
    ],
  });

  if (!newChat) {
    throw new ApiError(500, "Error while saving chat to database");
  }

  console.log(newChat);

  return newChat;
};

const appendChat = async ({ message }, LLMResponse) => {
  const { prompt, msgId, chatId } = message;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: {
        messages: {
          $each: [
            { id: msgId, role: "user", content: prompt },
            { role: "assistant", content: LLMResponse },
          ],
        },
      },
    },
    { new: true }
  );

  if (!updatedChat) {
    throw new ApiError(500, "Error while storing chat messages");
  }

  return updatedChat;
};

export { createNewChat, appendChat };
