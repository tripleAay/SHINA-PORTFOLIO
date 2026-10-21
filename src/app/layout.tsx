import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";

import { ThemeProvider } from "./contexts/ThemeContext";
import PageScrollControls from "./components/PageScrollControls";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://www.shinaadedokun.com";

const title =
  "Adeshina Adedokun | Software Engineer, Product & Design";

const description =
  "Adeshina Adedokun is a software engineer, product builder and brand designer in Lagos, Nigeria. Explore work across web development, engineering and design.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: title,
    template: "%s | Adeshina Adedokun",
  },

  description,

  authors: [
    {
      name: "Adeshina Adedokun",
      url: SITE_URL,
    },
  ],

  creator: "Adeshina Adedokun",

  openGraph: {
    type: "website",
    siteName: "Adeshina Adedokun",
    locale: "en_NG",
    title,
    description,
  },

  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
          <PageScrollControls />
        </ThemeProvider>
      </body>
    </html>
  );
}