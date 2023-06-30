import React from "react";
import { NextSeo } from "next-seo";

import { SignInForm } from "~/components/pages/auth";
import { Layout } from "~/components";
import { withSessionCheck } from "~/lib";
import { seoConfig } from "~/utils";

const SignIn = () => {
  return (
    <Layout>
      <NextSeo {...seoConfig("Sign In", "/auth/signin")} />
      <SignInForm />
    </Layout>
  );
};

export default SignIn;

export const getServerSideProps = withSessionCheck();
