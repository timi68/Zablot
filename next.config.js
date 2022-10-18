const { withPlausibleProxy } = require("next-plausible");

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    IMAGE_LOADER: "custom",
  },
  images: {
    loader: "custom",
    domains: [
      "localhost:3000",
      "zablot2.herokuapp.com",
      "play.tailwindcss.com",
    ],
  },
  reactStrictMode: true,
  poweredByHeader: false,
  output: "standalone",
};

module.exports = withPlausibleProxy()(nextConfig);
