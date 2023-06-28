import { object, z } from "zod";

export const signInSchema = object({
  email: z.string().min(1, "Email is required.").email("Not a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const signUpSchema = object({
  // username: z.string().min(6, "Username must be at least 6 characters."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  passwordConfirmation: z
    .string()
    .min(8, "Confirm password must be at least 8 characters."),
  email: z.string().min(1, "Email is required").email("Not a valid email."),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Passwords do not match",
  path: ["passwordConfirmation"],
});
