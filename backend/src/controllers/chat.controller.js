import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
// import { ollamaResponse } from "../utils/ollamaApi.js";
import { Chat } from "../models/chat.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createNewChat = asyncHandler(async (req, res) => {
  // {message, chatId} this two things come in req
  // chatId has to be null in order to create a new chat

  // extract both the things

  const { message, chatId } = req.body;

  //validate both the thing
  if (chatId != null) {
    throw new ApiError(400, "New chat cannot be created");
  }

  if (!message) {
    throw new ApiError(400, "Message is required");
  }

  // const reply = await ollamaResponse("user", message);

  if (!reply) {
    throw new ApiError(500, "Something went wrong please try again");
  }

  console.log(req.user);

  const chat = await Chat.create({
    chatTitle: "testing title",
    userId: req.user._id,
    message: [
      {
        role: "user",
        content: message,
      },
      {
        role: "assistant",
        content: reply,
      },
    ],
  });

  if (!chat) {
    throw new ApiError(500, "Chat is not saved to db");
  }


  return res
    .status(200)
    .json(new ApiResponse(200, "you are chating", reply, true));
});

export { createNewChat };
