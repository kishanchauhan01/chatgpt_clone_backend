import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { registerUserSchema } from "../schemas/user.schema.js";
import {
  isLoggedIn,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

// First validate the user info then register the user
router
  .route("/register")
  .post(
    upload.single("profile_pic"),
    validate(registerUserSchema),
    registerUser
  );

router.route("/login").post(loginUser);
router.route("/isLoggedIn").get(verifyJwt, isLoggedIn);
router.route("/logout").post(verifyJwt, logoutUser);

export default router;
