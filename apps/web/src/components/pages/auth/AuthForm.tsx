import React, { useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Formik, type FormikProps } from "formik";
import { type OAuthProviderType } from "next-auth/providers";
import { signIn } from "next-auth/react";
import nProgress from "nprogress";
import { toast } from "react-hot-toast";
import { toFormikValidationSchema } from "zod-formik-adapter";

import { APP_NAME, OAUTH_PROVIDERS } from "~/constants";
import { signInSchema, signUpSchema, type AuthSchemaType } from "~/schema";
import { api } from "~/utils";

export type AuthValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

interface AuthFormProps {
  type: "signIn" | "signUp";

  error?: string;
}

const validationSchema = {
  signIn: signInSchema,
  signUp: signUpSchema,
};

export const AuthForm = ({ type, error }: AuthFormProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const authError = searchParams.get("error")?.includes("OAuthAccountNotLinked")
    ? "Email is already linked to a different provider."
    : searchParams.get("error");

  const formikRef = useRef<FormikProps<AuthSchemaType>>(null);

  const handleSignIn = async (): Promise<void> => {
    const response = await signIn("credentials", {
      email: formikRef.current?.values.email,
      password: formikRef.current?.values.password,
      redirect: false,
    });

    if (response?.error) {
      formikRef.current?.setSubmitting(false);
      toast.error(response.error);
    }

    if (response?.ok) {
      router.push("/");
    }
  };

  const { mutate } = api.auth.createUser.useMutation({
    onSuccess: () => {
      handleSignIn();
      formikRef.current?.resetForm();
    },
    onSettled: () => {
      formikRef.current?.setSubmitting(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const buttonText = type === "signIn" ? "Log in" : "Sign Up";
  const buttonTextReverse = type === "signIn" ? "Sign Up" : "Log in";

  const onSubmit = (values: AuthValues) => {
    nProgress.configure({ showSpinner: true });
    nProgress.start();
    formikRef.current?.setSubmitting(true);

    if (type === "signIn") {
      handleSignIn();
    } else {
      mutate({
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });
    }

    nProgress.done();
  };

  const handleProviderSignIn: React.MouseEventHandler<HTMLButtonElement> = (
    e,
  ) => {
    (async () => {
      const id = e.currentTarget.id;
      const provider = id.replace("-sign-in", "") as OAuthProviderType;

      await signIn(provider, {
        callbackUrl: "/",
        redirect: false,
      });
    })();
  };

  return (
    <section className="padding-sides mb-[150px] mt-[50px]">
      <Formik
        innerRef={formikRef}
        initialValues={{ email: "", password: "", confirmPassword: "" }}
        validationSchema={toFormikValidationSchema(validationSchema[type])}
        onSubmit={(values) => {
          onSubmit(values);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form
            onSubmit={handleSubmit}
            className="mx-auto my-auto max-w-[500px] space-y-6 text-center"
            autoComplete="on"
          >
            <h1 className="sc-heading text-primary-400">{buttonText}</h1>
            <p className=" text-infoText">
              {type === "signIn"
                ? "Don't have an account?"
                : "Already have an account?"}{" "}
              <Link
                href={`/auth/${type === "signIn" ? "signup" : "signin"}`}
                className="text-primary-200 underline"
              >
                {buttonTextReverse}
              </Link>
            </p>
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0">
              {OAUTH_PROVIDERS.map(({ provider, Icon }) => (
                <button
                  key={provider}
                  id={`${provider.toLowerCase()}-sign-in`}
                  type="button"
                  className="btn-primary-lg mx-auto flex items-center justify-center space-x-3"
                  onClick={handleProviderSignIn}
                >
                  <Icon className="text-2xl text-white" />
                  <span>
                    {buttonText} with {provider}
                  </span>
                </button>
              ))}
            </div>
            <div className="text-separator text-infoText">OR</div>
            <div className="flex flex-col space-y-3">
              <input
                type="email"
                name="email"
                className={`border-bGray h-[55px] w-full rounded-lg border p-5 outline-none ${
                  errors.email && touched.email && "input-error"
                }`}
                placeholder="Email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="on"
              />

              <input
                type="password"
                name="password"
                className={`border-bGray h-[55px] w-full rounded-lg border p-5 outline-none ${
                  errors.password && touched.password && "input-error"
                }`}
                placeholder="Password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="on"
              />

              {type === "signUp" && (
                <input
                  type="password"
                  name="confirmPassword"
                  className={`border-bGray h-[55px] w-full rounded-lg border p-5 outline-none ${
                    errors.confirmPassword &&
                    touched.confirmPassword &&
                    "input-error"
                  }`}
                  placeholder="Confirm Password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="on"
                />
              )}
            </div>

            <p
              className={`duration-800 text-red-400 transition-all ease-in-out ${
                error || authError ? "opacity-1 h-full" : " h-0 opacity-0"
              }`}
            >
              {error ?? authError}
            </p>

            <button
              disabled={isSubmitting}
              type="submit"
              className={`btn-primary-lg ${
                isSubmitting && "btn-primary-disabled "
              }`}
            >
              {buttonText}
            </button>
            <p className="text-infoText text-sm">
              By {type === "signIn" ? "signing in" : "signing up"}, you agree to{" "}
              {APP_NAME}&apos;s{" "}
              <Link
                href="/pages/terms-of-service"
                target="_blank"
                rel="noopener noreferrer"
                className="simple-links text-infoText"
              >
                Terms of Service
              </Link>
              ,{" "}
              <Link
                href="/pages/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="simple-links text-infoText"
              >
                Privacy Policy
              </Link>{" "}
              and Use of Cookie.
            </p>
          </form>
        )}
      </Formik>
    </section>
  );
};
