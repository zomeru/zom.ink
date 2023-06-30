import React from "react";
import { NextSeo } from "next-seo";

import { Maintenance } from "~/components";
import { seoConfig } from "~/utils";

const About = () => {
  return (
    <>
      <NextSeo {...seoConfig("About", "/pages/about")} />
      <Maintenance />
    </>
  );
};

export default About;
