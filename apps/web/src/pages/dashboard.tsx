import React from "react";

import { Layout } from "~/components";
import { withSessionCheck } from "~/lib";

const Dashboard = () => {
  return (
    <Layout>
      <div>Dashboard</div>
    </Layout>
  );
};

export default Dashboard;

export const getServerSideProps = withSessionCheck();
