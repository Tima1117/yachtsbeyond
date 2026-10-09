import type { Metadata } from "next";
import { Inter_Tight, Manrope, Cormorant_Garamond, Noto_Sans_Georgian, Noto_Serif_Georgian } from "next/font/google";
import "./globals.css";

const display = Inter_Tight({ subsets: ["latin", "cyrillic"], weight: ["600", "700", "800"], variable: "--font-display", display: "swap" });
const body = Manrope({ subsets: ["latin", "cyrillic"], weight: ["400", "500", "600", "700", "800"], variable: "--font-body", display: "swap" });
const serif = Cormorant_Garamond({ subsets: ["latin", "cyrillic"], weight: ["500", "600"], style: ["italic", "normal"], variable: "--font-serif", display: "swap" });
const georgian = Noto_Sans_Georgian({ subsets: ["georgian"], weight: ["400", "600", "800"], variable: "--font-georgian", display: "swap" });
const georgianSerif = Noto_Serif_Georgian({ subsets: ["georgian"], weight: ["500"], variable: "--font-georgian-serif", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://yachtsbeyond.vercel.app"),
  title: "Yachts & Beyond — parasailing and boat trips from Batumi yacht club",
  description: "Parasailing from the deck of the Mustang speedboat, private boat trips, sunset cruises and jet ski from the yacht club pier on Batumi boulevard. Rated 4.5 by 44 guests on Google.",
  openGraph: {
    title: "Yachts & Beyond — parasailing and boat trips in Batumi",
    description: "Fly over Batumi, sunset at sea, your own boat for an hour. Yacht club pier on the boulevard. Rated 4.5 on Google.",
    url: "https://yachtsbeyond.vercel.app",
    siteName: "Yachts & Beyond",
    locale: "en_US",
    type: "website",
    images: [{ url: "/images/chute-mountains.webp", width: 1000, height: 1778 }],
  },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} ${serif.variable} ${georgian.variable} ${georgianSerif.variable}`}>{children}</body>
    </html>
  );
}
