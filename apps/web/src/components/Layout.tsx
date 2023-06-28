import React from "react";

import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-w-screen min-h-screen">
      <Navbar />
      <main className="h-full w-full">{children}</main>
      <Footer />
    </div>
  );
};
