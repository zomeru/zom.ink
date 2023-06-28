import React from "react";
import { GetServerSideProps } from "next";

import { ssrApi } from "~/utils/api";

const Slug = () => {
  return <div>Invalid URL</div>;
};

export default Slug;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { slug } = ctx.params as { slug: string };

  if (!slug) {
    return {
      props: {},
    };
  }

  const data = await ssrApi.url.bySlug.query(slug);

  if (data) {
    return {
      redirect: {
        destination: data.url,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
