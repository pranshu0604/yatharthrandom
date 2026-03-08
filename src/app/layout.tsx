import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { AuthProvider } from "@/components/layout/auth-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ReMemberX — Buy & Sell Premium Memberships",
  description:
    "India's trusted marketplace for buying and selling premium memberships. Discover club, gym, resort, and holiday memberships at great prices.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-black text-white selection:bg-amber-500/30`}>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen pt-20">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
