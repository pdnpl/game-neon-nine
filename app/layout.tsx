import type { Metadata } from "next";
import "./globals.css";

const title = "Neon Nine — Tic-tac-toe in a new light";
const description = "A premium local two-player tic-tac-toe game for the browser.";
const siteUrl = "https://neon-nine-play-20260810.knowosielski0.chatgpt.site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: { canonical: siteUrl },
  openGraph: {
    title,
    description,
    type: "website",
    url: siteUrl,
    images: [
      {
        url: `${siteUrl}/og.png`,
        width: 1536,
        height: 1024,
        alt: "Neon Nine — tic-tac-toe in a new light",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`${siteUrl}/og.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
