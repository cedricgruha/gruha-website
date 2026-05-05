import type { Metadata } from "next";
import { Fraunces, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/ui/AppProviders";
import Script from "next/script";

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
  title: {
    default: "Gruha.ai - AI-Powered Home Search Platform in Bengaluru",
    template: "%s | Gruha.ai"
  },
  description: "Experience the future of home buying in Bengaluru with Gruha.ai. Our AI-powered platform uses 8 specialized agents to help you search, evaluate, and secure your dream home with real-time data and deep location intelligence.",
  keywords: ["real estate Bengaluru", "AI property search", "home buying India", "RERA verified homes", "Bengaluru apartment search", "Gruha AI", "location intelligence real estate"],
  authors: [{ name: "Gruha.ai Team" }],
  creator: "Gruha.ai",
  publisher: "Gruha.ai",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Gruha.ai - AI-Powered Home Search Platform",
    description: "Smarter home searching and evaluation powered by AI specialists in Bengaluru.",
    url: "https://gruha.ai",
    siteName: "Gruha.ai",
    images: [
      {
        url: "/assets/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Gruha.ai - AI Home Search",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gruha.ai - AI-Powered Home Search",
    description: "Find your dream home in Bengaluru with AI specialists.",
    images: ["/assets/twitter-image.jpg"],
    creator: "@gruha_ai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: "https://gruha.ai",
  },
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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VDNW8C2RNE"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-VDNW8C2RNE');
          `}
        </Script>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
