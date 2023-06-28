import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  fixUrl,
  isValidSlug,
  isValidURL,
  slugGenerator,
} from "@zomink/utilities";

import {
  INVALID_SLUG_INPUT_ERROR_MESSAGE,
  INVALID_URL_ENTERED_ERROR_MESSAGE,
  INVALID_URL_ERROR_MESSAGE,
} from "../error";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { findUrlAndIsOwner } from "../utils";

const getUrlBySlug = z.object({
  slug: z
    .string()
    .min(5, INVALID_URL_ENTERED_ERROR_MESSAGE)
    .refine(isValidSlug, INVALID_URL_ENTERED_ERROR_MESSAGE),
  userAgent: z.string().optional(),
});

const createUrl = z.object({
  slug: z
    .string()
    .min(5, INVALID_SLUG_INPUT_ERROR_MESSAGE)
    .refine(isValidSlug, INVALID_SLUG_INPUT_ERROR_MESSAGE)
    .optional()
    .or(z.literal("")),
  url: z.string().refine(isValidURL, INVALID_URL_ERROR_MESSAGE),
  userId: z.string().optional(),
  localId: z.string().optional(),
});

const deleteUrl = z.object({
  id: z.string(),
  userId: z.string(),
});

const updateSlug = z.object({
  id: z.string(),
  slug: z
    .string()
    .min(5, INVALID_SLUG_INPUT_ERROR_MESSAGE)
    .refine(isValidSlug, INVALID_SLUG_INPUT_ERROR_MESSAGE),
  userId: z.string(),
});

export const urlRouter = createTRPCRouter({
  // Get all users urls
  // TODO: add pagination and filtering
  all: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const urls = await ctx.prisma.url.findMany({
      where: { userId: input },
      orderBy: { id: "desc" },
    });

    return urls;
  }),
  // TODO: add pagination and filtering
  getAllByLocalId: publicProcedure
    .input(z.string().min(1))
    .query(async ({ ctx, input }) => {
      const urls = await ctx.prisma.url.findMany({
        where: { userId: input },
        orderBy: { id: "desc" },
      });

      return urls;
    }),
  bySlug: publicProcedure.input(getUrlBySlug).query(async ({ ctx, input }) => {
    const { slug, userAgent } = input;

    // TODO: Add click tracking
    console.log("userAgent", decodeURIComponent(userAgent ?? ""));

    const url = await ctx.prisma.url.findUnique({ where: { slug } });

    if (!url) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: INVALID_URL_ENTERED_ERROR_MESSAGE,
      });
    }

    // Increment click count by 1
    await ctx.prisma.url.update({
      where: { slug },
      data: { clickCount: { increment: 1 } },
    });

    return url;
  }),
  create: publicProcedure.input(createUrl).mutation(async ({ ctx, input }) => {
    const { slug, url, userId } = input;

    const _slug = slug === "" || slug === undefined ? slugGenerator() : slug;

    const createShortUrl = await ctx.prisma.url.create({
      data: {
        slug: _slug,
        url: fixUrl(url),
        userId,
      },
    });

    return createShortUrl;
  }),
  delete: protectedProcedure
    .input(deleteUrl)
    .mutation(async ({ ctx, input }) => {
      const { id, userId } = input;

      await findUrlAndIsOwner(id, userId, ctx.prisma);

      await ctx.prisma.url.delete({ where: { id } });

      return {
        success: true,
      };
    }),
  update: protectedProcedure
    .input(updateSlug)
    .mutation(async ({ ctx, input }) => {
      const { id, slug, userId } = input;

      await findUrlAndIsOwner(id, userId, ctx.prisma);

      await ctx.prisma.url.update({ where: { id }, data: { slug } });

      return {
        success: true,
      };
    }),
});
