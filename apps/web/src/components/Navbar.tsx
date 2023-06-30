import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

import { NAV_LINKS } from "~/constants";
import { smoothScroll } from "~/utils";
import { Logo } from "./Logo";

export const Navbar = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const handleSignInSignOut = () => {
    if (session?.user) {
      signOut({ redirect: false }).then(() => router.push("/"));
    } else {
      router.push("/auth/signup");
    }
  };

  return (
    <header className="padding-sides w-auto">
      <nav className="max-width text-primary-500 flex h-[100px] w-full items-center justify-between">
        <Link href="/">
          <Logo />
        </Link>
        <div className="hidden items-center space-x-[20px] sm:flex md:space-x-[30px]">
          {NAV_LINKS.map(({ name, link }) => {
            if (name === "Log in" && session?.user) {
              return null;
            }
            const newName: string =
              session?.user && name === "My URLs" ? "Dashboard" : name;

            if (["github", "donate"].indexOf(newName.toLowerCase()) > -1) {
              return (
                <Link
                  key={newName}
                  className={`links ${
                    newName === "Donate" &&
                    "after:bg-pink-600 hover:text-pink-600"
                  }`}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {newName}
                </Link>
              );
            }

            if (link.startsWith("#")) {
              return (
                <Link
                  href={link}
                  key={newName}
                  className="links"
                  onClick={smoothScroll}
                >
                  {newName}
                </Link>
              );
            }

            return (
              <Link
                href={newName === "Dashboard" ? "/dashboard" : link}
                key={newName}
                className="links"
              >
                {newName}
              </Link>
            );
          })}
          <button
            type="button"
            className="btn-primary"
            onClick={handleSignInSignOut}
          >
            {session?.user ? "Log out" : "Sign up"}
          </button>
        </div>
      </nav>
    </header>
  );
};
