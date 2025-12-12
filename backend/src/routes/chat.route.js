import { Router } from "express";
import {
  getAllChats,
  getChatMessages,
} from "../controllers/chat.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

// Get all the chats
router.route("/getAllChats").get(verifyJwt, getAllChats);
router.route("/:chatId/messages").get(verifyJwt, getChatMessages);


export default router;
