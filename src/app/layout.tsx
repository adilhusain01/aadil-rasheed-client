import type { Metadata } from "next";
import { Libre_Baskerville, Nunito_Sans } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import ConditionalLayout from "@/components/ConditionalLayout";

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
    <html lang="en" className={`${libreBaskerville.variable} ${nunitoSans.variable}`}>
      <ClientBody>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </ClientBody>
    </html>
  );
}
