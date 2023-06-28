import { type GetServerSideProps } from "next";
import { getServerSession } from "next-auth";

import { authOptions } from "@zomink/auth";

/**
 * If user is not logged in, redirect to /auth/signin
 * If user is logged in, redirect to /dashboard
 *
 * @returns
 */
export function withSessionCheck(): GetServerSideProps {
  return async (context) => {
    const url = context.resolvedUrl;

    const session = await getServerSession(
      context.req,
      context.res,
      authOptions,
    );

    if (url.includes("/auth") && session) {
      return {
        redirect: {
          destination: "/dashboard",
          permanent: false,
        },
      };
    }

    if (url.includes("/dashboard") && !session) {
      return {
        redirect: {
          destination: "/auth/signin",
          permanent: false,
        },
      };
    }

    return {
      props: {},
    };
  };
}
