import React from "react";
import { NextSeo } from "next-seo";

import { Maintenance } from "~/components";
import { seoConfig } from "~/utils";

const Report = () => {
  return (
    <>
      <NextSeo {...seoConfig("Report", "/pages/report")} />
      <Maintenance />
    </>
  );
};

export default Report;
