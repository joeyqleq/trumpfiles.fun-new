import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import AsciiFooter from "@/components/AsciiFooter";
import TrumpsteinChat from "@/components/TrumpsteinChat";
import "./globals.css";
import Script from "next/script";
import { arcticGuardian, arcticGuardian3D, arcticGuardianGrad, arcticGuardianGradItalic, arcticGuardianLaser, arcticGuardianLaserItalic, arcticGuardianHalf, arcticGuardianTwoTone, arcticGuardianTwoToneItalic, arcticGuardianLeft, neuething, instrumentSerif, spaceGrotesk, playfairDisplay, sourceSerif, jetbrainsMono } from "@/lib/fonts";
// import BlobCursor from "@/components/ui/BlobCursor";
import AnimatedBackground from "@/components/AnimatedBackground";
import { sql } from "@/lib/neonClient";
import { Analytics } from '@vercel/analytics/next';

// Fetch entry count for dynamic metadata
async function getEntryCount(): Promise<number> {
  try {
    const result = await sql`SELECT COUNT(*) as count FROM ai_complete_trump_data`;
    return parseInt(result[0]?.count || "1100", 10);
  } catch {
    return 1100; // Fallback
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const entryCount = await getEntryCount();

  const title = "The Trump Files | Encyclopedia Orange";
  const description = `An interactive thermal encyclopedia cataloging ${entryCount}+ documented incidents, scandals, and absurd moments from Donald J. Trump. AI-analyzed, timestamped, and scored for accuracy and impact.`;
  const siteUrl = "https://trumpfiles.fun";

  return {
    title: {
      default: title,
      template: "%s | The Trump Files"
    },
    description,
    keywords: [
      "Trump",
      "Donald Trump",
      "Trump scandals",
      "Trump crimes",
      "Trump database",
      "Trump files",
      "presidential scandals",
      "Trump encyclopedia",
      "Trump timeline",
      "Trump data visualization",
      "Trump accountability",
      "Trump incidents",
      "Trump catalog"
    ],
    authors: [{ name: "The Trump Files Team" }],
    creator: "The Trump Files",
    publisher: "The Trump Files",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: {
      icon: [{
        url: "/favicon/favicon.ico"
      }, {
        url: "/favicon/favicon.svg",
        type: "image/svg+xml"
      }, {
        url: "/favicon/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png"
      }],
      apple: [{
        url: "/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png"
      }]
    },
    manifest: "/favicon/site.webmanifest",
    metadataBase: new URL(siteUrl),

    // OpenGraph for Facebook, LinkedIn, etc.
    // og:image is served dynamically by app/opengraph-image.tsx
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteUrl,
      siteName: "The Trump Files",
      title,
      description,
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@thetrumpfiles",
      site: "@thetrumpfiles",
    },

    // Additional SEO
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    // Verification (add your IDs when available)
    verification: {
      // google: "your-google-verification-id",
      // yandex: "your-yandex-verification-id",
    },

    // Alternate languages (if needed in future)
    alternates: {
      canonical: siteUrl,
    },

    // Category
    category: "politics",
  };
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <meta name="theme-color" content="#FF6500" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Tianji Analytics — tracks trumpfiles.fun + trumpstein.me */}
        <Script
          src="https://numbers.trumpstein.me/tracker.js"
          data-website-id="cmrimayfs000glftpxjbjo4he"
          strategy="afterInteractive"
        />

        {/* JSON-LD Structured Data */}
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "The Trump Files",
              "alternateName": "Encyclopedia Orange",
              "url": "https://trumpfiles.fun",
              "description": "An interactive thermal encyclopedia cataloging documented incidents, scandals, and absurd moments from Donald J. Trump.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://trumpfiles.fun/catalog?search={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body suppressHydrationWarning className={`
          ${arcticGuardian.variable}
          ${arcticGuardian3D.variable}
          ${arcticGuardianGrad.variable}
          ${arcticGuardianGradItalic.variable}
          ${arcticGuardianLaser.variable}
          ${arcticGuardianLaserItalic.variable}
          ${arcticGuardianHalf.variable}
          ${arcticGuardianTwoTone.variable}
          ${arcticGuardianTwoToneItalic.variable}
          ${arcticGuardianLeft.variable}
          ${neuething.variable}
          ${instrumentSerif.variable}
          ${spaceGrotesk.variable}
          ${playfairDisplay.variable}
          ${sourceSerif.variable}
          ${jetbrainsMono.variable}
          font-sans antialiased min-h-screen bg-background
        `}>
        <AnimatedBackground>
          {/* <BlobCursor /> */}
          <Navigation />
          <main className="pt-16">
            {children}
          </main>
          <AsciiFooter />
          <TrumpsteinChat />
        </AnimatedBackground>
        <Analytics />
      </body>
    </html>
  );
}
