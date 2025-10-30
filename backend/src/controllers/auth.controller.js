import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // Get the user info
  const { username, email, password } = req.body;

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
  });

  //check if user is created or not
  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Error while creating user");
  }

  // return the response
  return res
    .status(201)
    .json(new ApiResponse(201, "User Created", createdUser, true));
});

export { registerUser };
