import { mongoose, Schema } from "mongoose";

const chatSchema = new Schema(
  {
    chatTitle: {
      type: String,
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    message: [
      {
        role: {
          type: String,
          enum: ["user", "assistant", "system"],
          required: true,
        },

        content: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export const Chat = mongoose.model("Chat", chatSchema);
