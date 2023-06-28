import React from "react";
import { type NextPage } from "next";
import Image from "next/image";

import { Layout } from "~/components";

const NotFound: NextPage<{ message?: string }> = ({ message }) => {
  return (
    <Layout>
      <div className="flex h-full w-full flex-col items-center space-y-5 px-5 py-20">
        <div className="relative h-[200px] w-[200px] sm:h-[350px] sm:w-[350px] ">
          <Image src="/assets/images/404.png" fill alt="Not found" />
        </div>
        <div className="space-y-3 text-center md:space-y-6">
          <h2 className="text-primary-500 text-4xl font-bold sm:text-5xl md:text-6xl">
            Something went wrong!
          </h2>
          <p className="text-base sm:text-lg md:text-xl">
            {message && message !== ""
              ? message
              : "Page not found. Maybe you have clicked or entered an invalid link."}
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
