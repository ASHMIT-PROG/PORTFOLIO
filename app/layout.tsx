import type { Metadata } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { site } from "@/data/site";
import { getSiteUrl } from "@/lib/site-url";
import { navigationLabels } from "@/data/navigation";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const display = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-instrument-serif", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: { default: `${site.name} — Portfolio`, template: `%s — ${site.name}` },
  description: site.description,
  icons: { icon: site.avatar.src },
  openGraph: { title: `${site.name} — Portfolio`, description: site.description, siteName: `${site.name} — Portfolio`, type: "website", locale: "en_US" },
  twitter: { card: "summary_large_image", title: `${site.name} — Portfolio`, description: site.description },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${inter.variable} ${display.variable} ${mono.variable} font-sans antialiased`}>
        <noscript><style>{`.scroll-reveal, .stagger-item { opacity: 1 !important; transform: none !important; }`}</style></noscript>
        <Providers>
          <div className="relative flex min-h-svh flex-col">
            <div aria-hidden="true" className="page-column pointer-events-none absolute inset-y-0 inset-x-0 -z-0" />
            <a href="#main-content" className="skip-link">{navigationLabels.skip}</a>
            <Navbar />
            <main id="main-content" tabIndex={-1} className="relative flex-1 outline-none">{children}</main>
            <div className="relative"><Footer /></div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
