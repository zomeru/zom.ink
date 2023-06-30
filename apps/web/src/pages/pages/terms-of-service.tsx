import React from "react";
import { NextSeo } from "next-seo";

import { Maintenance } from "~/components";
import { seoConfig } from "~/utils";

const TermsOfService = () => {
  return (
    <>
      <NextSeo {...seoConfig("Terms of Service", "/pages/terms-of-service")} />
      <Maintenance />
    </>
  );
};

export default TermsOfService;
