import React from "react";
import Link from "next/link";

import { Layout } from "./Layout";

export const Maintenance = () => {
  return (
    <Layout>
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Maintenance</h1>
        <p className="text-xl">This page is currently in development.</p>
        <Link href="/" className="text-primary-300 px-3 py-2">
          Go back to home page.
        </Link>
      </div>
    </Layout>
  );
};
