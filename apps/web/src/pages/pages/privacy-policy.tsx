import React from "react";
import { NextSeo } from "next-seo";

import { seoConfig } from "~/utils/seoConfig";
import { Maintenance } from "~/components";

const PrivacyPolicy = () => {
  return (
    <>
      <NextSeo {...seoConfig("Privacy Policy", "/pages/privacy-policy")} />
      <Maintenance />
    </>
  );
};

export default PrivacyPolicy;
