import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Footer from "@/components/footer";

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
      </head>
      <body className={manrope.className}>
        {children}
        <Toaster />
        <Sonner />
        <Footer />
      </body>
    </html>
  );
}
