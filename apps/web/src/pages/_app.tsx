import "../styles/globals.css";
import "nprogress/nprogress.css";

import type { AppType } from "next/app";
import { Router } from "next/router";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import nprogress from "nprogress";
import { Toaster } from "react-hot-toast";

import { api } from "~/utils";

Router.events.on("routeChangeStart", () => {
  nprogress.configure({ showSpinner: false });
  nprogress.start();
});
Router.events.on("routeChangeComplete", () => nprogress.done());
Router.events.on("routeChangeError", () => nprogress.done());

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      <Toaster />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
