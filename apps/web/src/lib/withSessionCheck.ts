import { type GetServerSideProps } from "next";

import { getServerSession } from "@zomink/auth";

/**
 * If user is logged in and is in auth pages, redirect to /dashboard
 * Use this to redirect logged in users from auth pages to dashboard
 */
export function withSessionCheck(): GetServerSideProps {
  return async (context) => {
    const url = context.resolvedUrl;

    const session = await getServerSession(context);

    if (url.includes("/auth") && session) {
      return {
        redirect: {
          destination: "/dashboard",
          permanent: false,
        },
      };
    }

    return {
      props: {},
    };
  };
}
