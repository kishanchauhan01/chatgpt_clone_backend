import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { refreshAccessAndRefreshToken } from "../controllers/user.controller.js";

const verifyJwt = asyncHandler(async (req, res, next) => {
  try {
    const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    console.log(accessToken);

    const refreshToken =
      req.cookies?.refreshToken || req.header("x-refresh-token");

    const decodedToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user;
    req.accessToken = accessToken;
    req.refreshToken = refreshToken;
    next();
  } catch (error) {
    if (error.name == "TokenExpiredError") {
      return refreshAccessAndRefreshToken(req, res, next);
    }
    throw new ApiError(401, "Invalid or expired token");
  }
});

export { verifyJwt };

