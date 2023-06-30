import { TRPCError } from "@trpc/server";
import { UAParser } from "ua-parser-js";
import { z } from "zod";

import {
  fixUrl,
  isValidSlug,
  isValidURL,
  slugGenerator,
} from "@zomink/utilities";

import {
  INVALID_DOMAIN_ERROR_MESSAGE,
  INVALID_SLUG_INPUT_ERROR_MESSAGE,
  INVALID_URL_ENTERED_ERROR_MESSAGE,
  INVALID_URL_ERROR_MESSAGE,
} from "../error";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { type GeoInfo } from "../types";
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
    .max(32, INVALID_SLUG_INPUT_ERROR_MESSAGE)
    .optional()
    .or(z.literal(""))
    .refine((slug) => {
      return slug === "" || slug === undefined || isValidSlug(slug);
    }, INVALID_SLUG_INPUT_ERROR_MESSAGE),
  url: z
    .string()
    .min(1)
    .refine((url) => isValidURL(url, false), INVALID_URL_ERROR_MESSAGE)
    .refine((url) => isValidURL(url), INVALID_DOMAIN_ERROR_MESSAGE),
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
    .max(32, INVALID_SLUG_INPUT_ERROR_MESSAGE)
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
        where: { localId: input },
        orderBy: { id: "desc" },
      });

      return urls;
    }),
  bySlug: publicProcedure.input(getUrlBySlug).query(async ({ ctx, input }) => {
    const { slug, userAgent } = input;

    try {
      const url = await ctx.prisma.url.findUnique({ where: { slug } });

      if (!url) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: INVALID_URL_ENTERED_ERROR_MESSAGE,
        });
      }

      return url;
    } catch (error) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: INVALID_URL_ENTERED_ERROR_MESSAGE,
      });
    } finally {
      // Increment click count by 1
      await ctx.prisma.url.update({
        where: { slug },
        data: { clickCount: { increment: 1 } },
      });

      const foundUrl = await ctx.prisma.url.findUnique({ where: { slug } });

      if (userAgent !== undefined && foundUrl) {
        const ipAddress =
          process.env.NODE_ENV === "development"
            ? process.env.MY_IP_ADDRESS
            : ctx.req.socket.remoteAddress;
        const info = await fetch(`http://ip-api.com/json/${ipAddress}
        `)
          .then((res) => res.json() as Promise<GeoInfo>)
          .catch(() => undefined);

        const decodedUserAgent = decodeURIComponent(userAgent);
        const uaParser = new UAParser(decodedUserAgent);
        const { browser, device, os } = uaParser.getResult();

        await ctx.prisma.click.create({
          data: {
            urlId: foundUrl.id,
            userId: foundUrl.userId,
            browser: browser.name,
            browserVersion: browser.version,
            os: os.name,
            device: device.model,
            deviceVendor: device.vendor,
            osVersion: os.version,
            country: info?.country,
            region: info?.regionName,
            city: info?.city,
            latitude: info?.lat,
            longitude: info?.lon,
          },
        });
      }
    }
  }),
  create: publicProcedure.input(createUrl).mutation(async ({ ctx, input }) => {
    const { slug, url, userId, localId } = input;

    const _slug = slug === "" || slug === undefined ? slugGenerator() : slug;

    const createShortUrl = await ctx.prisma.url.create({
      data: {
        slug: _slug,
        url: fixUrl(url),
        userId,
        localId,
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
