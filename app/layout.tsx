import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });
const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ColinaHealth",
  description: "EMR Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
    <html lang="en">
      <head>
        <link rel="icon" href="/icons/colinahealthlogo.png" />
        <link rel="preload" href="/imgs/colina-logo-animation.gif" as="image" />
      </head>
      <body className={manrope.className}>{children}</body>
    </html>
  );
}
