import { authRouter, postRouter, urlRouter } from "./router/";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  post: postRouter,
  auth: authRouter,
  url: urlRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
