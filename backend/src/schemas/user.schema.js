import { email, z } from "zod";

export const registerUserSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be less than 3 characters")
    .trim(),

  email: z.string().email("Invalid email format"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password too long"),
});
