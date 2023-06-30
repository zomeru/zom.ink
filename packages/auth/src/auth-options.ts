import { PrismaAdapter } from "@next-auth/prisma-adapter";
import argon2 from "argon2";
import type { DefaultSession, NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";

import { prisma, type Role } from "@zomink/db";

import { env } from "../env.mjs";

/**
 * Module augmentation for `next-auth` types
 * Allows us to add custom properties to the `session` object
 * and keep type safety
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      username?: string;
      role: Role;
      totalClicks: number;
      totalUrls: number;
      createdAt: Date;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    username?: string;
    role: Role;
    totalClicks: number;
    totalUrls: number;
    banned: boolean;
    createdAt: Date;
  }
}

/**
 * Options for NextAuth.js used to configure
 * adapters, providers, callbacks, etc.
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
        token.email = user.email;
        token.username = user.username;
        token.role = user.role;
        token.totalClicks = user.totalClicks;
        token.totalUrls = user.totalUrls;
        token.createdAt = user.createdAt;
      }

      return Promise.resolve(token);
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.uid as string;
        session.user.email = token.email as string;
        session.user.username = token.username as string;
        session.user.role = token.role as Role;
        session.user.totalClicks = token.totalClicks as number;
        session.user.totalUrls = token.totalUrls as number;
        session.user.createdAt = token.createdAt as Date;
      }

      return Promise.resolve(session);
    },
    signIn: async (session) => {
      if (session.user.banned) {
        return Promise.reject(new Error("Your account has been banned."));
      }

      return Promise.resolve(true);
    },
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      id: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "example@domain.com",
          value: "",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const invalidCredentialsError = new Error("Invalid email or password.");

        if (!credentials?.email || !credentials?.password) {
          return Promise.reject(new Error("Email and password are required"));
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          return Promise.reject(invalidCredentialsError);
        }

        const isCredentialsValid = await argon2.verify(
          user?.password ?? "",
          credentials.password,
        );

        if (!isCredentialsValid) {
          return Promise.reject(invalidCredentialsError);
        }

        return Promise.resolve({
          id: user.id,
          email: user.email,
          username: user.username,
          totalClicks: user.totalClicks,
          totalUrls: user.totalUrls,
          createdAt: user.createdAt,
        } as User);
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    newUser: "/dashboard",
    signOut: "/",
    error: "/auth/signin",
  },
};
