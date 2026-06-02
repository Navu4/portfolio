import Layout from "@/components/layout";
import "@/styles/globals.css";
import UtilityFunction from "@/utils";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect, useState } from "react";
import NextNProgress from "nextjs-progressbar";
import { Inter, Space_Grotesk } from "next/font/google";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});
const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-space-grotesk",
    display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        setIsMobile(UtilityFunction.isMobileDevice());
        document.documentElement.classList.add(
            inter.variable,
            spaceGrotesk.variable
        );
    }, []);
    return (
        <>
            <Head>
                <title>Navjot Singh &#128640; | Portfolio </title>
                <link
                    rel="icon"
                    type="image/x-icon"
                    href="https://res.cloudinary.com/dr4kgyjzt/image/upload/v1693134398/zd89y97mltcvy2i6sd9m.png"
                />

                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="Navjot" />
                <meta
                    property="og:image"
                    content="https://res.cloudinary.com/dr4kgyjzt/image/upload/v1693137206/gj9n7rvccadhplh5vyvr.png"
                />
                <meta name="twitter:site" content="@Navjot Singh &#128640;" />
                <meta name="twitter:creator" content="@Navjot Singh &#128640;" />
                <meta name="twitter:card" content="summary" />
                <meta
                    name="twitter:image:src"
                    content="https://res.cloudinary.com/dr4kgyjzt/image/upload/v1693137206/gj9n7rvccadhplh5vyvr.png"
                />

                <base href="/" />
            
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta
                    name="apple-mobile-web-app-status-bar-style"
                    content="black"
                />
                <meta name="apple-mobile-web-app-title" content="Navjot Singh &#128640;" />

                <link
                    rel="apple-touch-icon"
                    href="https://res.cloudinary.com/dr4kgyjzt/image/upload/v1693137206/gj9n7rvccadhplh5vyvr.png"
                    sizes="192x192"
                />
                <link
                    rel="alternate"
                    href="https://res.cloudinary.com/dr4kgyjzt/image/upload/v1693137206/gj9n7rvccadhplh5vyvr.png"
                />
            </Head>
            <div className={`${inter.variable} ${spaceGrotesk.variable} ${inter.className}`}>
                <Layout isMobile={isMobile}>
                    <NextNProgress color="#3b82f6" />
                    <Component isMobile={isMobile} {...pageProps} />
                </Layout>
            </div>
        </>
    );
}
