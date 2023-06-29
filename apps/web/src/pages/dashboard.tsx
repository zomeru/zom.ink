import React from "react";
import { NextSeo } from "next-seo";

import { seoConfig } from "~/utils/seoConfig";
import { Layout } from "~/components";
import { withSessionCheck } from "~/lib";

const Dashboard = () => {
  return (
    <Layout>
      <NextSeo {...seoConfig("Dashboard", "/dashboard")} />
      <div>Dashboard</div>
    </Layout>
  );
};

export default Dashboard;

export const getServerSideProps = withSessionCheck();
