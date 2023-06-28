import React from "react";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";

import { INVALID_URL_ENTERED_ERROR_MESSAGE } from "@zomink/api/src/error";
import { type Prisma } from "@zomink/db";

import { ssrApi } from "~/utils/api";
import NotFound from "./404";

type SlugProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const Slug: NextPage<SlugProps> = ({ data }) => {
  return <NotFound message={data.error?.message} />;
};

export default Slug;

type UrlType = Prisma.UrlGetPayload<Record<string, never>>["url"];

export const getServerSideProps: GetServerSideProps<{
  data: { url: UrlType | null; error?: { message: string } | null };
}> = async (ctx) => {
  const { slug } = ctx.params as { slug: string };
  const userAgent = ctx.req.headers["user-agent"];

  const data = await ssrApi.url.bySlug
    .query({
      slug,
      userAgent: encodeURIComponent(userAgent ?? ""),
    })
    .then((response) => response)
    .catch((err: { message: string }) => {
      return {
        url: null,
        error: {
          message: err.message.includes("prisma")
            ? INVALID_URL_ENTERED_ERROR_MESSAGE
            : err.message,
        },
      };
    });

  if (data.url) {
    return {
      redirect: {
        destination: data.url,
        permanent: true,
      },
    };
  }

  return {
    props: {
      data,
    },
  };
};
