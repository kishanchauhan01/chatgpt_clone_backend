import { Router } from "express";
import { createNewChat } from "../controllers/chat.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

//Create new chat
router.route("/").post(verifyJwt, createNewChat);

export default router;
