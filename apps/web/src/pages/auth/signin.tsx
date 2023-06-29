import React from "react";
import { NextSeo } from "next-seo";

import { seoConfig } from "~/utils/seoConfig";
import { SignInForm } from "~/components/pages/auth";
import { Layout } from "~/components";
import { withSessionCheck } from "~/lib";

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
