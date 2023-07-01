import "../styles/globals.css";
import "nprogress/nprogress.css";

import type { AppType } from "next/app";
import { Router } from "next/router";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { NextSeo } from "next-seo";
import nprogress from "nprogress";
import { Toaster } from "react-hot-toast";

import { UserUrlsProvider } from "~/contexts";
import { api, seoConfig } from "~/utils";

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
      <NextSeo {...seoConfig()} />
      <UserUrlsProvider>
        <Component {...pageProps} />
      </UserUrlsProvider>
      <Toaster
        containerStyle={{
          zIndex: 2147483647,
        }}
      />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
