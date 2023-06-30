import React from "react";
import { NextSeo } from "next-seo";

import { SignUpForm } from "~/components/pages/auth";
import { Layout } from "~/components";
import { withSessionCheck } from "~/lib";
import { seoConfig } from "~/utils";

const SignUp = () => {
  return (
    <Layout>
      <NextSeo {...seoConfig("Sign Up", "/auth/signup")} />
      <SignUpForm />
    </Layout>
  );
};

export default SignUp;

export const getServerSideProps = withSessionCheck();
