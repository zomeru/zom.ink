import { authRouter, urlRouter } from "./router/";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  url: urlRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
