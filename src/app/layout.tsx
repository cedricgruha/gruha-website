import type { Metadata } from "next";
import { Fraunces, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/ui/AppProviders";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gruha.ai"),
  title: "Gruha.ai - AI-Powered Home Search Platform | Find Your Dream Home in Bengaluru",
  description: "Better way to search, shortlist, evaluate and select your home. AI-powered platform with 8 specialists, real-time data, and comprehensive location intelligence.",
  keywords: "real estate, property search, Bengaluru homes, AI home search, property evaluation, RERA verified, home buying",
  openGraph: {
    title: "Gruha.ai - Find Your Perfect Home",
    description: "AI-powered platform for smarter home searching and evaluation",
    url: "https://gruha.ai",
    siteName: "Gruha.ai",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gruha.ai - AI-Powered Home Search",
    description: "Find your dream home with AI specialists",
    images: ["/twitter-image.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${spaceGrotesk.variable} antialiased`}
    >
      <body className="flex flex-col font-inter bg-white text-dark">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
