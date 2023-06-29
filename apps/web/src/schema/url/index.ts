import { object, z } from "zod";

import {
  INVALID_DOMAIN_ERROR_MESSAGE,
  INVALID_SLUG_INPUT_ERROR_MESSAGE,
  INVALID_URL_ERROR_MESSAGE,
} from "@zomink/api/src/error";
import { isValidURL } from "@zomink/utilities";

export const createShortURLSchema = object({
  url: z
    .string()
    .min(1)
    .refine((url) => isValidURL(url, false), INVALID_URL_ERROR_MESSAGE)
    .refine((url) => isValidURL(url), INVALID_DOMAIN_ERROR_MESSAGE),
  userId: z.string().optional(),
  slug: z
    .string()
    .min(5, INVALID_SLUG_INPUT_ERROR_MESSAGE)
    .max(32, INVALID_SLUG_INPUT_ERROR_MESSAGE)
    .optional()
    .or(z.literal("")),
  localId: z.string().optional(),
});

export type CreateShortURLSchemaType = z.infer<typeof createShortURLSchema>;
