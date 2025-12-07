import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    // Get the user payload
    const user = await User.findById(userId);

    // Generate the tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Store the refresh token in db
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: true });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating the token");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // Get the user info
  const { username, email, password } = req.body;

  const profile_pic = req.file
    ? `/uploads/user/profile_pic/${req.file.filename}`
    : null;

  //check for exists or not
  const isExistsUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (isExistsUser) {
    throw new ApiError(409, "User already exists");
  }

  //create the user
  const user = await User.create({
    username,
    email,
    password,
    profile_pic,
  });

  //check if user is created or not
  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Error while creating user");
  }

  // return the response
  return res
    .status(201)
    .json(new ApiResponse(201, "User Created", createdUser));
});

const loginUser = asyncHandler(async (req, res) => {
  //get the username/email and password

  const { email, password } = req.body;
  // Check if user is exists or not
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not exists");
  }

  //check whether the password is correct or not
  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid password");
  }

  //generate access and refresh token
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const logedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, `${logedInUser.username} login successfully`, {
        user: logedInUser,
        accessToken,
        refreshToken,
      })
    );
});

const refreshAccessAndRefreshToken = asyncHandler(async (req, res, next) => {
  //veerify and validate the refresh token
  const refreshToken =
    req.cookies?.refreshToken || req.header("x-refresh-token");

  if (!refreshToken) {
    throw new ApiError(400, "Refresh token missing");
  }

  try {
    const decodedToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id).select("-password");

    if (!user || user.refreshToken !== refreshToken) {
      throw new ApiError(400, "Invalid refresh token");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    const options = {
      httpOnly: true,
      secure: true,
    };

    req.user = user;
    req.accessToken = accessToken;
    req.refreshToken = newRefreshToken;

    res
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options);

    next();
  } catch (error) {
    throw new ApiError(401, "Refresh token invalid or expired");
  }
});

const isLoggedIn = asyncHandler(async (req, res) => {
  const user = req.user;
  const accessToken = req.accessToken;
  const refreshToken = req.refreshToken;

  if (!user) {
    throw new ApiError(400, "Please login");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, "user is logged in", {
        user,
        accessToken,
        refreshToken,
      })
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  // remove the cookies
  // and refresh token from the db

  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User Logout successfully", null));
});

export {
  registerUser,
  loginUser,
  refreshAccessAndRefreshToken,
  isLoggedIn,
  logoutUser,
};
