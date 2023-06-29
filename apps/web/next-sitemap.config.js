/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_URL,
  generateRobotsTxt: true,
  exclude: ["/dashboard"],
};
