module.exports = {
  reactStrictMode: false,
  eslint: { ignoreDuringBuilds: true },
  async redirects() {
    return [
      {
        source: "/dashboard/:path",
        destination: "/dashboard?p=:path",
        permanent: true,
      },
    ];
  },
};
