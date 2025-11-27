import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/cn";
import { Navbar } from "@/components/navbar";
import { profile, socialLinks } from "@/data/content";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: `${profile.name} | ${profile.role}`,
  description: profile.summary,
  metadataBase: new URL("https://chowsean.com")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(inter.variable, jetbrains.variable)}>
      <body className="bg-bg-beige text-text-primary antialiased" id="top">
        <Navbar />
        <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-0">{children}</main>
        <footer id="contact" className="border-t-2 border-border-heavy bg-bg-beige">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="font-mono">© {new Date().getFullYear()} {profile.name}</p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="underline-offset-2 hover:text-accent-orange hover:underline"
                >
                  {social.label}
                </a>
              ))}
            </div>
            <p className="text-text-secondary">Building engineer-first products.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
