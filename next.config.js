module.exports = {
	reactStrictMode: false,
	eslint: {ignoreDuringBuilds: true},
	resolve: {
		fallback: {
			util: require.resolve("util/"),
		},
	},
};
