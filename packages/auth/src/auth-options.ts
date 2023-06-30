import { PrismaAdapter } from "@next-auth/prisma-adapter";
import argon2 from "argon2";
import { type DefaultSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";

import { prisma } from "@zomink/db";

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
    } & DefaultSession["user"];
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
      }

      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.uid as string;
      }

      return session;
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

        return {
          id: user.id,
          email: user.email,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    newUser: "/dashboard",
    signOut: "/",
  },
};
