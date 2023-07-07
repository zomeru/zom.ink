import { type NextSeoProps } from "next-seo";

import { APP_DESCRIPTION, APP_TITLE, APP_URL } from "~/constants";

const imgUrl = `/assets/images/app_image.png`;

export const seoConfig = (
  additional?: string,
  route?: string,
): NextSeoProps => {
  const title = `${additional ? "Zomink" : APP_TITLE}${
    additional ? " | " + additional : ""
  }`;
  const url = `${APP_URL}${route ? route : ""}`;

  return {
    title,
    description: APP_DESCRIPTION,
    canonical: url,
    openGraph: {
      type: "website",
      url,
      title,
      description: APP_DESCRIPTION,
      images: [
        {
          url: imgUrl,
          width: 1600,
          height: 800,
          alt: title,
          type: "image/png",
        },
      ],
      siteName: title,
    },
    twitter: {
      cardType: "summary_large_image",
    },
    additionalLinkTags: [
      {
        rel: "icon",
        href: "/favicon.ico",
        type: "image/x-icon",
      },
      {
        rel: "apple-touch-icon",
        href: "/icons/apple-touch-icon.png",
        sizes: "180x180",
      },
      {
        rel: "manifest",
        href: "/manifest.json",
      },
    ],
    additionalMetaTags: [
      {
        name: "viewport",
        content:
          "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
      },
    ],
  };
};
