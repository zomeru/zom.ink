import React from "react";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { NextSeo } from "next-seo";

import { INVALID_URL_ENTERED_ERROR_MESSAGE } from "@zomink/api/src/error";

import { seoConfig, ssrApi } from "~/utils";
import NotFound from "./404";

type SlugProps = InferGetServerSidePropsType<typeof getServerSideProps>;

type UrlMetadata = {
  title: string;
  description: string;
  images: string[];
  url: string;
};

const Slug: NextPage<SlugProps> = ({ data }) => {
  return (
    <>
      <NextSeo
        title={data.metadata?.title}
        description={data.metadata?.description}
        canonical={data.metadata?.url}
        openGraph={{
          type: "website",
          url: data.metadata?.url,
          title: data.metadata?.title,
          description: data.metadata?.description,
          images: [
            {
              url: data.metadata?.images[0] ?? "",
            },
          ],
          siteName: data.metadata?.title,
        }}
      />
      <NotFound message={data.error?.message} />
    </>
  );
};

export default Slug;

export const getServerSideProps: GetServerSideProps<{
  data: {
    metadata?: UrlMetadata;
    error?: { message: string };
  };
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

  const metadata = await fetch(
    `https://jsonlink.io/api/extract?url=${
      data.url ?? process.env.NEXTAUTH_URL
    }`,
  )
    .then(async (res) => (await res.json()) as UrlMetadata)
    .catch(() => null);

  const seo = seoConfig();
  const _metadata =
    metadata ??
    ({
      title: seo.title,
      description: seo.description,
      images: [seo.openGraph?.images?.[0]?.url],
      url: seo.openGraph?.url,
    } as UrlMetadata);

  if (data.url) {
    return {
      props: {
        data: {
          metadata: _metadata,
        },
      },
      redirect: {
        destination: data.url,
        permanent: true,
      },
    };
  }

  return {
    props: {
      data: {},
    },
  };
};
