import React from "react";
import { useSession } from "next-auth/react";

import {
  Banner,
  FAQ,
  Features,
  Hero,
  ShortenField,
} from "~/components/pages/home";
import { Layout } from "~/components";

const Home = () => {
  const { data: session } = useSession();
  console.log("session", session);

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
