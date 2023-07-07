import { TRPCError } from "@trpc/server";
import { UAParser } from "ua-parser-js";
import { z } from "zod";

import { Prisma } from "@zomink/db";
import {
  fixUrl,
  isValidSlug,
  isValidURL,
  slugGenerator,
} from "@zomink/utilities";

import {
  DEFAULT_ERROR_MESSAGE,
  INVALID_DOMAIN_ERROR_MESSAGE,
  INVALID_SLUG_INPUT_ERROR_MESSAGE,
  INVALID_URL_ENTERED_ERROR_MESSAGE,
  INVALID_URL_ERROR_MESSAGE,
  SLUG_ALREADY_EXISTS_ERROR_MESSAGE,
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
  all: publicProcedure
    .input(z.string().min(1))
    .query(async ({ ctx, input }) => {
      const urls = await ctx.prisma.url.findMany({
        where: {
          OR: [{ userId: input }, { localId: input }],
        },
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

      if (foundUrl?.userId) {
        await ctx.prisma.user.update({
          where: { id: foundUrl.userId },
          data: { totalClicks: { increment: 1 } },
        });
      }

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
  bulkCreate: publicProcedure
    .input(z.array(createUrl))
    .mutation(async ({ ctx, input }) => {
      const urls = input.map((url) => ({
        slug:
          url.slug === "" || url.slug === undefined
            ? slugGenerator()
            : url.slug,
        url: fixUrl(url.url),
        userId: url.userId,
        localId: url.localId,
      }));

      const createShortUrls = await ctx.prisma.url.createMany({
        data: urls,
        skipDuplicates: true,
      });

      if (urls[0]?.userId) {
        await ctx.prisma.user.update({
          where: { id: urls[0].userId },
          data: { totalUrls: { increment: urls.length } },
        });
      }

      return createShortUrls;
    }),
  create: publicProcedure.input(createUrl).mutation(async ({ ctx, input }) => {
    const { slug, url, userId, localId } = input;

    const _slug = slug === "" || slug === undefined ? slugGenerator() : slug;

    try {
      const createShortUrl = await ctx.prisma.url.create({
        data: {
          slug: _slug,
          url: fixUrl(url),
          userId,
          localId,
        },
      });

      if (userId) {
        await ctx.prisma.user.update({
          where: { id: userId },
          data: { totalUrls: { increment: 1 } },
        });
      }

      return createShortUrl;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: SLUG_ALREADY_EXISTS_ERROR_MESSAGE,
          });
        }
      }

      throw new TRPCError({
        code: "BAD_REQUEST",
        message: DEFAULT_ERROR_MESSAGE,
      });
    }
  }),
  delete: protectedProcedure
    .input(deleteUrl)
    .mutation(async ({ ctx, input }) => {
      const { id, userId } = input;

      await findUrlAndIsOwner(id, userId, ctx.prisma);

      await ctx.prisma.url.delete({ where: { id } });

      await ctx.prisma.user.update({
        where: { id: userId },
        data: { totalUrls: { decrement: 1 } },
      });

      return {
        success: true,
      };
    }),
  bulkDelete: protectedProcedure
    .input(z.array(deleteUrl))
    .mutation(async ({ ctx, input }) => {
      const ids = input.map((url) => url.id);

      await ctx.prisma.url.deleteMany({ where: { id: { in: ids } } });

      await ctx.prisma.user.update({
        where: { id: input[0]?.userId },
        data: { totalUrls: { decrement: ids.length } },
      });

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
