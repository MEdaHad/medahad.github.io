import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Or choose a suitable monospace font
import "./globals.css";
import Header from "@/components/Header"; // We'll create this
import Footer from "@/components/Footer"; // We'll create this
import AnimatedBackground from "@/components/AnimatedBackground"; // We'll create this
import CursorParticles from "@/components/CursorParticles"; // Import the new component

const inter = Inter({ subsets: ["latin"] });
// Example using Fira Code:
// import { Fira_Code } from "next/font/google";
// const firaCode = Fira_Code({ subsets: ["latin"], weight: ['400', '700'] });

export const metadata: Metadata = {
  title: "Medhane Hadush | Cybersecurity Portfolio",
  description: "Portfolio showcasing Medhane Hadush's cybersecurity skills and projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} relative overflow-x-hidden`}>
        {/* Static Animated background */}
        <AnimatedBackground />
        {/* Cursor Following Particles (Client Component) */}
        <CursorParticles />

        {/* Content Wrapper */}
        <div className="relative z-10 min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
             {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
} 