import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    serverExternalPackages: ['pino' , 'pino-pretty'],
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
