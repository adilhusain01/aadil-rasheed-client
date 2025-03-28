import type { Metadata } from "next";
import { Libre_Baskerville, Nunito_Sans } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import Footer from "@/components/Footer";
import StickyHeader from "@/components/StickyHeader";
import Head from "next/head";

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Aadil Rasheed",
    template: "Aadil Rasheed",
  },
  description: "My poetic Journey",
  keywords: [
    "mental health",
    "wellness",
    "lifestyle",
    "self-care",
    "mindfulness",
    "blog",
    "personal development",
  ],
  authors: [{ name: "Aadil Rasheed" }],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aadilrasheed.vercel.app/",
    title: "Aadil Rasheed",
    description: "My poetic Journey",
    siteName: "My poetic Journey",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
      </Head>
      <html
        lang="en"
        className={`${libreBaskerville.variable} ${nunitoSans.variable}`}
      >
        <ClientBody>
          <div className="flex flex-col min-h-screen pt-4 md:pt-16">
            <StickyHeader />
            <main className="flex-1">{children}</main>
            <div id="contact">
              <Footer />
            </div>
          </div>
        </ClientBody>
      </html>
    </>
  );
}
