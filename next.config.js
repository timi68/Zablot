module.exports = {
  reactStrictMode: false,
  eslint: { ignoreDuringBuilds: true },
  async rewrites() {
    return [
      {
        source: "/dashboard/:path",
        destination: "/dashboard",
      },
      {
        source: "/quiz/attempt/:id",
        destination: "/quiz/attempt?view=:id",
      },
    ];
  },
};
