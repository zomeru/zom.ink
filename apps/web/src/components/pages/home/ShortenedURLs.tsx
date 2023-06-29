import React, { useEffect, useState } from "react";
import Link from "next/link";

import { type RouterOutputs } from "@zomink/api";
import { removeUrlPrefix } from "@zomink/utilities";

import { APP_URL } from "~/constants";

const UrlComponent = ({
  onCopy,
  shortURL,
  showSeparator,
  url,
  copied,
}: {
  onCopy: () => void;
  url: string;
  shortURL: string;
  showSeparator: boolean;
  copied: boolean;
}) => {
  return (
    <div className="space-y-5">
      <div>
        <div className="flex flex-col justify-between sm:flex-row">
          <p className="text-primary-500 my-auto w-full truncate sm:w-[300px]">
            {url}
          </p>
          <div className="mr-2 flex flex-col items-start space-x-4 sm:flex-row sm:items-center">
            <Link
              href={shortURL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-200 truncate"
            >
              {shortURL}
            </Link>
            <button
              type="button"
              className="text-primary-300 mt-3 block self-center sm:hidden"
              onClick={onCopy}
              disabled={copied}
            >
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              onClick={onCopy}
              disabled={copied}
              type="button"
              className="btn-secondary hidden h-[35] sm:block"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
        {showSeparator && <div className="bg-bGray my-5 h-[2px] w-full" />}
      </div>
    </div>
  );
};

export type UrlType = RouterOutputs["url"]["getAllByLocalId" | "all"];

export const ShortenedURLs = ({ urls }: { urls?: UrlType }) => {
  const [urlCopied, setUrlCopied] = useState<string | undefined>(undefined);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (urlCopied) {
        setUrlCopied(undefined);
      }
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [urlCopied]);

  if (!urls || urls.length === 0) return null;

  const firstItem = urls[0];
  const otherItems = urls.length > 3 ? urls.slice(1, 3) : urls.slice(1);

  const copyToClipBoard = async (url: string, id: string) => {
    try {
      setUrlCopied(undefined);
      await navigator.clipboard.writeText(url);

      setUrlCopied(id);
    } catch (err) {
      setUrlCopied(undefined);
    }
  };

  return (
    <div className="mt-4 w-full rounded-lg bg-white p-[20px]">
      <UrlComponent
        onCopy={async (): Promise<void> => {
          await copyToClipBoard(
            `${process.env.NEXT_PUBLIC_URL}/${firstItem?.slug}`,
            firstItem?.id ?? "",
          );
        }}
        copied={urlCopied === firstItem?.id}
        shortURL={`${removeUrlPrefix(`${APP_URL}/${firstItem?.slug}`, false)}`}
        url={firstItem?.url ?? ""}
        showSeparator
      />
      {otherItems.map((item) => {
        const url = `${APP_URL}/${item.slug}`;
        const shortURL = removeUrlPrefix(url, false);

        return (
          <UrlComponent
            onCopy={async (): Promise<void> => {
              await copyToClipBoard(`${APP_URL}/${item.slug}`, item.id);
            }}
            copied={urlCopied === item.id}
            key={item.id}
            shortURL={shortURL}
            url={item.url}
            showSeparator
          />
        );
      })}
      <div className="">
        <div className="flex w-full items-center justify-between space-x-2">
          <h2 className="text-primary-500 text-base font-bold sm:text-xl">
            Want to manage, customize, and track your links?
          </h2>
          <button type="button" className="btn-primary">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};
