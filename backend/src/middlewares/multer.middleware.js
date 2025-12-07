import multer from "multer";
import fs from "fs";
import { ApiError } from "../utils/ApiError.js";

const uploadPath = "./public/uploads/user/profile_pic";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileType = ["image/jpg", "image/png", "image/jpeg"];
  if (allowedFileType.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, "Only JPG, JPEG, and PNG files are allowed"), false);
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, //only 8mb is allowed
  fileFilter,
});
