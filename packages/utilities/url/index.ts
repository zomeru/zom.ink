import { customAlphabet } from "nanoid";

import BLOCKED_DOMAINS from "./blocked-domains";

const regExProtocol = /^(https?:\/\/)/i;

/**
 * Generate a random slug
 *
 * @param length Length of the slug to generate, defaults to 5
 */
export const slugGenerator = (length: number | undefined = 5): string => {
  const alphaNumeric =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  return customAlphabet(alphaNumeric, length)();
};

/**
 * Remove trailing slashes from a URL and add http:// if it's missing
 *
 * @param url URL string to fix
 */
export const fixUrl = (url: string): string => {
  const fixedUrl = url.replace(/\/+$/, "");
  const hasProtocol = regExProtocol.exec(fixedUrl);

  const newUrl = hasProtocol ? fixedUrl : `http://${fixedUrl}`;

  return newUrl;
};

/**
 * Remove http(s):// and www. from a URL
 *
 * @param url URL string
 */
export const removeUrlPrefix = (url: string): string => {
  const regExWWW = /^(www\.)/i;

  const newUrl = url.replace(regExProtocol, "").replace(regExWWW, "");

  return newUrl.trim();
};

/**
 * Check if a URL is valid and not in the blocked domains list
 *
 * @param url URL string to check
 */
export const isValidURL = (url: string): boolean => {
  const regEx =
    /^(https?:\/\/)?(www\.)?[a-z0-9]+([-.][a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

  /**
   * This utility function will be used in server and
   * client validation, so we need to check if
   * NEXTAUTH_URL is defined, if not, we use NEXT_PUBLIC_URL
   */
  const MY_URL = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_URL;

  const myHost = removeUrlPrefix(MY_URL || "");
  const urlHost = removeUrlPrefix(url);

  // Check if url is valid, not the same as the our own url, and not in the blocked domains list
  return (
    regEx.test(urlHost) &&
    myHost !== urlHost &&
    !BLOCKED_DOMAINS.includes(urlHost)
  );
};

/**
 * Check if a slug is alphanumeric
 *
 * @param slug Slug string to check
 */
export const isValidSlug = (slug: string): boolean => {
  const regEx = /^[a-zA-Z0-9]+$/;

  return regEx.test(slug);
};