import React from "react";

import { AuthForm, type AuthValues } from "./AuthForm";

export const SignInForm = () => {
  const onSubmit = (
    values: AuthValues,
    setSubmitting: (submit: boolean) => void,
  ) => {
    // TODO: Implement sign in with credentials
    console.log(values);
    setSubmitting(false);
  };

  return <AuthForm type="signIn" onSubmit={onSubmit} />;
};
