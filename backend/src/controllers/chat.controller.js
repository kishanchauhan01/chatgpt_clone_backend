import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Chat } from "../models/chat.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createNewChat = async ({ message }, LLMResponse, chatTitle) => {
  const { prompt, msgId, userId, chatId, isNewChat } = message;

  if (!userId) {
    throw new ApiError(404, "UserId is required");
  }

  const newChat = await Chat.create({
    chatTitle,
    userId,
    messages: [
      { id: msgId, role: "user", content: prompt },
      { role: "assistant", content: LLMResponse },
    ],
  });

  if (!newChat) {
    throw new ApiError(500, "Error while saving chat to database");
  }

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

const getAllChats = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  if (!_id) {
    throw new ApiError(400, "User is invalid or logged out");
  }

  const userChats = await Chat.find({ userId: _id }, "chatTitle _id");

  if (!userChats) {
    throw new ApiError(500, "Error while fetching user's chats");
  }

  if (userChats.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, "User have zero conversation", userChats));
  }

  return res.status(200).json(new ApiResponse(200, "All chats", userChats));
});

const getChatMessages = asyncHandler(async (req, res) => {
  const chatId = req.params.chatId;

  if (!chatId) {
    throw new ApiError(400, "Chat is not specified");
  }

  const { messages } = await Chat.findById(chatId, "messages -_id");

  if (!messages) {
    throw new ApiError(500, "Error while fetching messages of chat");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Fetched messages", { messages }));
});

export { createNewChat, appendChat, getAllChats, getChatMessages };
