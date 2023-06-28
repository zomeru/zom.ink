import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Formik, type FormikProps } from "formik";
import { useSession } from "next-auth/react";
import nProgress from "nprogress";
import { toFormikValidationSchema } from "zod-formik-adapter";

import { fixUrl, isValidURL, slugGenerator } from "@zomink/utilities";

import { api } from "~/utils/api";
import { TextError } from "~/components/TextError";
import { APP_NAME, LOCAL_USER_ID } from "~/constants";
import { useError } from "~/hooks";
import { createShortURLSchema, type CreateShortURLSchemaType } from "~/schema";
import { ShortenedURLs } from "./ShortenedURLs";

export const ShortenField = () => {
  const { data: session } = useSession();
  const ctx = api.useContext();

  const formikRef = useRef<FormikProps<CreateShortURLSchemaType>>(null);

  const [shortenError, setShortenError] = useError();
  const [localId, setLocalId] = useState("");

  useEffect(() => {
    const local = localStorage.getItem(LOCAL_USER_ID) ?? slugGenerator(10);

    localStorage.setItem(LOCAL_USER_ID, local);
    setLocalId(local);
  }, []);

  const userUrls = api.url.all.useQuery(session?.user?.id ?? "");
  const localUrls = api.url.getAllByLocalId.useQuery(localId);

  const { mutate } = api.url.create.useMutation({
    onSuccess: async () => {
      await ctx.url.all.invalidate();
      await ctx.url.getAllByLocalId.invalidate();

      if (session?.user) {
        userUrls.refetch();
      } else {
        localUrls.refetch();
      }
    },
    onSettled: () => {
      nProgress.done();
      formikRef.current?.setSubmitting(false);
      formikRef.current?.resetForm();
    },
    onError: (err) => {
      setShortenError(err.message);
    },
  });

  const onShorten = (values: { url: string; slug?: string }) => {
    setShortenError("");
    nProgress.configure({ showSpinner: true });
    nProgress.start();

    const newLink = isValidURL(values.url) ? fixUrl(values.url) : values.url;

    if (session?.user) {
      mutate({
        url: newLink,
        slug: values.slug,
        userId: session.user.id,
      });
    } else {
      mutate({
        url: newLink,
        slug: values.slug,
        localId,
      });
    }
  };

  const hasUrls =
    (userUrls && !!userUrls.data?.length) ||
    (localUrls && !!localUrls.data?.length);

  return (
    <section
      id="shortener"
      className="padding-sides bg-primary-500 my-[20px] w-full py-[35px] 2xl:my-[50px]"
    >
      <Formik
        innerRef={formikRef}
        initialValues={{ url: "", slug: "", userId: "", localId: "" }}
        validationSchema={toFormikValidationSchema(createShortURLSchema)}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);
          onShorten(values);
        }}
      >
        {({
          values,
          errors,
          // touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form
            className={`max-width my-auto h-full  ${
              hasUrls ? "space-y-5" : "space-y-3"
            }`}
            onSubmit={handleSubmit}
          >
            <div className="flex w-full flex-col space-x-0 space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
              <input
                type="text"
                name="url"
                className={`h-[45px] w-full rounded-lg px-5 text-sm 
                outline-none sm:h-auto sm:text-base ${
                  errors.url && values.url.length > 0
                    ? "input-error text-red-600"
                    : "text-sky-600"
                }`}
                placeholder="Paste your link here"
                value={values.url}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <input
                type="text"
                name="slug"
                className={`h-[45px] w-full rounded-lg px-5 text-sm outline-none sm:h-auto sm:w-[180px] sm:text-base md:w-[250px] ${
                  errors.slug && !!values.slug && values.slug.length > 0
                    ? "input-error text-red-600"
                    : "text-sky-600"
                }`}
                placeholder="Slug (optional)"
                value={values.slug}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <button
                disabled={
                  isSubmitting ||
                  (!!errors.url && errors.url !== "Link is required") ||
                  !!errors.slug
                }
                type="submit"
                className={`btn-primary-lg ${
                  isSubmitting ||
                  (!!errors.url && errors.url !== "Link is required") ||
                  errors.slug
                    ? "btn-primary-disabled"
                    : ""
                }`}
              >
                Shorten
              </button>
            </div>
            <p className="text-center text-xs font-light text-white sm:text-sm">
              By clicking Shorten, you are agreeing to {APP_NAME}&apos;s{" "}
              <strong>
                <Link
                  href="/pages/terms-of-service"
                  className="simple-links hover:text-primary-100 underline"
                >
                  Terms of Service
                </Link>
              </strong>
              ,{" "}
              <strong>
                {" "}
                <Link
                  href="/pages/privacy-policy"
                  className="simple-links hover:text-primary-100 underline"
                >
                  Privacy Policy
                </Link>
              </strong>
              , and <strong>Use of Cookies</strong>.
            </p>
            <TextError
              showError={
                !shortenError &&
                !!errors.slug &&
                !!values.slug &&
                values.slug.length > 0
              }
              errorText={errors.slug!}
              className={`mb-[20px] ${hasUrls ? "h-[25px]" : ""}`}
              dotClassName={hasUrls ? "-translate-y-[8px]" : ""}
            />
            <TextError
              showError={!shortenError && !!errors.url && values.url.length > 0}
              errorText={errors.url!}
              className={`mb-[20px] ${hasUrls ? "h-[25px]" : ""}`}
              dotClassName={hasUrls ? "-translate-y-[8px]" : ""}
            />
            <TextError
              showError={!!shortenError}
              errorText={shortenError!}
              className={`mb-[20px] ${hasUrls ? "h-[25px]" : ""}`}
              dotClassName={hasUrls ? "-translate-y-[8px]" : ""}
            />

            {shortenError && !!errors.url && hasUrls && (
              <div className="mt-[10px] h-[1px]" />
            )}
            <ShortenedURLs
              urls={session?.user ? userUrls.data : localUrls.data}
            />
          </form>
        )}
      </Formik>
    </section>
  );
};
