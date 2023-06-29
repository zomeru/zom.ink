import React from "react";
import { NextSeo } from "next-seo";

import { seoConfig } from "~/utils/seoConfig";
import { Maintenance } from "~/components";

const TermsOfService = () => {
  return (
    <>
      <NextSeo {...seoConfig("Terms of Service", "/pages/terms-of-service")} />
      <Maintenance />
    </>
  );
};

export default TermsOfService;
