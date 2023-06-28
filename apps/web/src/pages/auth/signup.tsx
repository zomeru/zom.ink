import React from "react";

import { SignUpForm } from "~/components/pages/auth";
import { Layout } from "~/components";
import { withSessionCheck } from "~/lib";

const SignUp = () => {
  return (
    <Layout>
      <SignUpForm />
    </Layout>
  );
};

export default SignUp;

export const getServerSideProps = withSessionCheck();
