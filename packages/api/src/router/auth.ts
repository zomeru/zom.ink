import { TRPCError } from "@trpc/server";
import { hash } from "argon2";
import { z } from "zod";

import {
  EMAIL_ALREADY_EXISTS_ERROR_MESSAGE,
  INVALID_CONFIRM_PASSWORD_ERROR_MESSAGE,
  INVALID_PASSWORD_ERROR_MESSAGE,
} from "../error";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

const createUser = z
  .object({
    email: z.string().email(),
    password: z.string().min(8, INVALID_PASSWORD_ERROR_MESSAGE),
    confirmPassword: z.string().min(8, INVALID_CONFIRM_PASSWORD_ERROR_MESSAGE),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    INVALID_CONFIRM_PASSWORD_ERROR_MESSAGE,
  );

export const authRouter = createTRPCRouter({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    // testing type validation of overridden next-auth Session in @zomink/auth package
    return "you can see this secret message!";
  }),
  createUser: publicProcedure
    .input(createUser)
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;

      const existingUser = await ctx.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: EMAIL_ALREADY_EXISTS_ERROR_MESSAGE,
        });
      }

      const hashedPassword = await hash(password);

      const user = await ctx.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });

      return user;
    }),
});
