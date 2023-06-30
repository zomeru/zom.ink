import React from "react";
import { NextSeo } from "next-seo";

import { Layout } from "~/components";
import { seoConfig } from "~/utils";

const Dashboard = () => {
  return (
    <Layout>
      <NextSeo {...seoConfig("Dashboard", "/dashboard")} />
      <div>Dashboard</div>
    </Layout>
  );
};

export default Dashboard;
