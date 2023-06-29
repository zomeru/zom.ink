import { object, z } from "zod";

import {
  INVALID_CONFIRM_PASSWORD_ERROR_MESSAGE,
  INVALID_PASSWORD_ERROR_MESSAGE,
} from "@zomink/api/src/error";

export const signInSchema = object({
  email: z.string().min(1, "Email is required.").email("Not a valid email."),
  password: z.string().min(1),
});

export const signUpSchema = object({
  // username: z.string().min(6, "Username must be at least 6 characters."),
  password: z.string().min(8, INVALID_PASSWORD_ERROR_MESSAGE),
  confirmPassword: z.string().min(8, INVALID_CONFIRM_PASSWORD_ERROR_MESSAGE),
  email: z.string().min(1, "Email is required").email("Not a valid email."),
}).refine((data) => data.password === data.confirmPassword, {
  message: INVALID_CONFIRM_PASSWORD_ERROR_MESSAGE,
  path: ["confirmPassword"],
});

export type AuthSchemaType = z.infer<typeof signUpSchema>;
