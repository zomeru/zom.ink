import React from "react";
import { NextSeo } from "next-seo";

import { seoConfig } from "~/utils/seoConfig";
import { SignUpForm } from "~/components/pages/auth";
import { Layout } from "~/components";
import { withSessionCheck } from "~/lib";

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
