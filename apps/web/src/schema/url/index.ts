import { object, z } from "zod";

import { isValidURL } from "@zomink/utilities";

export const createShortURLSchema = object({
  url: z
    .string()
    .min(1, "Invalid URL")
    .refine((url) => isValidURL(url, false), "Invalid URL")
    .refine(
      (url) => isValidURL(url),
      "We're sorry but we don't accept links from this domain",
    ),
  userId: z.string().optional(),
  slug: z
    .string()
    .min(5, "Alias must be 5 alphanumeric characters")
    .optional()
    .or(z.literal("")),
  localId: z.string().optional(),
});

export type CreateShortURLSchemaType = z.infer<typeof createShortURLSchema>;
