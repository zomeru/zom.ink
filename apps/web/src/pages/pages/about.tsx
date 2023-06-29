import React from "react";
import { NextSeo } from "next-seo";

import { seoConfig } from "~/utils/seoConfig";
import { Maintenance } from "~/components";

const About = () => {
  return (
    <>
      <NextSeo {...seoConfig("About", "/pages/about")} />
      <Maintenance />
    </>
  );
};

export default About;
