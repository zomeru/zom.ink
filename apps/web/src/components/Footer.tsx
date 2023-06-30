import React, { forwardRef } from "react";
import Link from "next/link";

import { APP_NAME, FOOTER_LINKS, FOOTER_SOCIALS } from "~/constants";
import { smoothScroll } from "~/utils";
import { Logo } from "./Logo";

type FooterProps = Record<string, never>;

export const Footer = forwardRef<HTMLElement, FooterProps>((_, ref) => {
  return (
    <footer ref={ref}>
      <div className="padding-sides py-[60px] sm:py-[80px] ">
        <div className="max-width flex max-w-[1000px] flex-col items-center justify-between space-y-8 sm:flex-row sm:items-start sm:space-y-0">
          {FOOTER_LINKS.map(({ title, links }) => (
            <div key={title}>
              <h3 className="text-primary-500 mb-2 text-center text-lg font-semibold sm:text-start">
                {title}
              </h3>
              <div className="flex flex-col space-y-1">
                {links.map(({ name, link, isNewTab }) => {
                  if (link.startsWith("#")) {
                    return (
                      <Link
                        href={link}
                        key={name}
                        className="simple-links text-infoText text-center sm:text-start "
                        onClick={smoothScroll}
                      >
                        {name}
                      </Link>
                    );
                  }

                  return (
                    <Link
                      key={name}
                      href={link}
                      target={isNewTab ? "_blank" : "_self"}
                      rel={isNewTab ? "noopener noreferrer" : ""}
                      className="simple-links text-infoText text-center sm:text-start "
                    >
                      {name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
          <div>
            <div className="text-center sm:text-start">
              <Logo />
            </div>
            <div className="text-infoText">
              <h1 className="text-center sm:text-start">
                &copy; 2023 | {APP_NAME}
              </h1>
              <h2 className="text-center sm:text-start">
                Free Custom Link Shortener
              </h2>
              <h2 className="text-center sm:text-start">
                Link Management, Link Analytics
              </h2>
              <p className="text-center sm:text-start">All rights reserved.</p>
              <div className="flex items-center justify-center space-x-1 sm:justify-start">
                {FOOTER_SOCIALS.map(({ name, Icon, link }, index) => (
                  <Link
                    key={name}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon
                      style={{
                        fontSize: `${index * 4 + 40}px`,
                      }}
                      className="text-infoText hover:text-primary-200 transition-all duration-300 ease-in-out"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="bg-primary-200 flex h-[40px] w-full items-center justify-center">
        <p className="text-sm text-white sm:text-base">
          Built by{" "}
          <Link
            href="https://github.com/zomeru"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-all duration-200 ease-in-out hover:text-neutral-200"
          >
            Zomer Gregorio
          </Link>
        </p>
      </div> */}
    </footer>
  );
});
