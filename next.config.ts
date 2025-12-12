import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "tse1.mm.bing.net",
                port: ""
            }
        ]
    }
};

export default nextConfig;
