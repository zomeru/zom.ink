import React from "react";

import { SignInForm } from "~/components/pages/auth";
import { Layout } from "~/components";
import { withSessionCheck } from "~/lib";

const SignIn = () => {
  return (
    <Layout>
      <SignInForm />
    </Layout>
  );
};

export default SignIn;

export const getServerSideProps = withSessionCheck();
