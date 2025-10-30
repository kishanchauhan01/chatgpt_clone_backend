import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { registerUserSchema } from "../schemas/user.schema.js";
import { registerUser } from "../controllers/auth.controller.js";

const router = Router();

// First validate the user info then register the user
router.route("/register").post(validate(registerUserSchema), registerUser);

export default router;
