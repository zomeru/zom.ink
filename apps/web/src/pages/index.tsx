import React from "react";

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
