/** @type {import('next').NextConfig} */

const nextConfig = {
    experimental: {
        crossOriginIsolation: true,
    },
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "Cross-Origin-Opener-Policy",
						value: "same-origin",
					},
					{
						key: "Cross-Origin-Embedder-Policy",
						value: "require-corp",
					},
				],
			},
		];
	},
};

export default nextConfig;
