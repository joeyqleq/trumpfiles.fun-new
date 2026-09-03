import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import AsciiFooter from "@/components/AsciiFooter";
import TrumpsteinChat from "@/components/TrumpsteinChat";
import "./globals.css";
import Script from "next/script";
import { adhesianSerif, arcticGuardian, arcticGuardian3D, arcticGuardianGrad, arcticGuardianGradItalic, arcticGuardianLaser, arcticGuardianLaserItalic, arcticGuardianHalf, arcticGuardianHalfItalic, arcticGuardianTwoTone, arcticGuardianTwoToneItalic, arcticGuardianLeft, hilsfiger, outfit, syne, instrumentSerif, spaceGrotesk, playfairDisplay, sourceSerif, jetbrainsMono } from "@/lib/fonts";
// import BlobCursor from "@/components/ui/BlobCursor";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Analytics } from '@vercel/analytics/next';

export async function generateMetadata(): Promise<Metadata> {
  const title = "Trumpstein: Encyclopedia Orange";
  const description = "A source-aware, satirical public archive of documented Trump incidents, statements, relationships, and political consequences. Trumpstein Files lives on here as the archive's heritage collection.";
  const siteUrl = "https://trumpstein.me";

  return {
    title: {
      default: title,
      template: "%s | Trumpstein"
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
    authors: [{ name: "Trumpstein / Trumpstein Files Archive" }],
    creator: "Trumpstein",
    publisher: "Trumpstein: Encyclopedia Orange",
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
      siteName: "Trumpstein: Encyclopedia Orange",
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
              "name": "Trumpstein: Encyclopedia Orange",
              "alternateName": ["Trumpstein Files", "Encyclopedia Orange"],
              "url": "https://trumpstein.me",
              "description": "A source-aware, satirical public archive of documented Trump incidents, statements, relationships, and political consequences.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://trumpstein.me/catalog?search={search_term_string}"
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
          ${arcticGuardianHalfItalic.variable}
          ${arcticGuardianTwoTone.variable}
          ${arcticGuardianTwoToneItalic.variable}
          ${arcticGuardianLeft.variable}
          ${outfit.variable}
          ${syne.variable}
          ${hilsfiger.variable}
          ${adhesianSerif.variable}
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
