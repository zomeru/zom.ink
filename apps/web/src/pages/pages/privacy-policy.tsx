import React from "react";
import { NextSeo } from "next-seo";

import { Maintenance } from "~/components";
import { seoConfig } from "~/utils";

const PrivacyPolicy = () => {
  return (
    <>
      <NextSeo {...seoConfig("Privacy Policy", "/pages/privacy-policy")} />
      <Maintenance />
    </>
  );
};

export default PrivacyPolicy;
