import React from "react";
import { NextSeo } from "next-seo";

import { seoConfig } from "~/utils/seoConfig";
import {
  Banner,
  FAQ,
  Features,
  Hero,
  ShortenField,
} from "~/components/pages/home";
import { Layout } from "~/components";

const Home = () => {
  return (
    <Layout>
      <NextSeo {...seoConfig()} />
      <div className="flex h-full w-full flex-col items-center justify-center">
        <Hero />
        <ShortenField />
        <Features />
        <FAQ />
        <Banner />
      </div>
    </Layout>
  );
};

export default Home;
