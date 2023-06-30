import React from "react";
import { NextSeo } from "next-seo";

import { Layout } from "~/components";
import { withSessionCheck } from "~/lib";
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

export const getServerSideProps = withSessionCheck();
