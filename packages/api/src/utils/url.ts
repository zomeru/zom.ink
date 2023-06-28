/* eslint-disable @typescript-eslint/consistent-type-imports */

import { TRPCError } from "@trpc/server";

import { prisma } from "@zomink/db";

import {
  INVALID_URL_ID_ERROR_MESSAGE,
  INVALID_USER_ERROR_MESSAGE,
} from "../error";

/**
 * Finds a URL and checks if the user is the owner
 *
 * @param urlId ID of the URL to find
 * @param userId ID of the user to check against
 * @param prisma Prisma client
 *
 * @throws {TRPCError} If the URL ID is invalid
 * @throws {TRPCError} If the user ID is invalid
 */
export const findUrlAndIsOwner = async (
  urlId: string,
  userId: string,
  _prisma: typeof prisma,
): Promise<void> => {
  const url = await _prisma.url.findUnique({ where: { id: urlId } });

  if (!url) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: INVALID_URL_ID_ERROR_MESSAGE,
    });
  }

  if (url.userId !== userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: INVALID_USER_ERROR_MESSAGE,
    });
  }
};
