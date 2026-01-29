import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import AsciiFooter from "@/components/AsciiFooter";
import "./globals.css";
import Script from "next/script";
import { arcticGuardian, arcticGuardian3D, arcticGuardianGrad, arcticGuardianGradItalic, arcticGuardianLaser, arcticGuardianLaserItalic, arcticGuardianHalf, arcticGuardianTwoTone, arcticGuardianTwoToneItalic, arcticGuardianLeft, neuething } from "./fonts";
import BlobCursor from "@/components/ui/BlobCursor";
import AnimatedBackground from "@/components/AnimatedBackground";
import { sql } from "@/lib/neonClient";

// Fetch entry count for dynamic metadata
async function getEntryCount(): Promise<number> {
  try {
    const result = await sql`SELECT COUNT(*) as count FROM ai_complete_trump_data`;
    return parseInt(result[0]?.count || "940", 10);
  } catch {
    return 940; // Fallback
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const entryCount = await getEntryCount();

  const title = "The Trump Files | Encyclopedia Orange";
  const description = `An interactive thermal encyclopedia cataloging ${entryCount}+ documented incidents, scandals, and absurd moments from Donald J. Trump. AI-analyzed, timestamped, and scored for danger, insanity, and lawlessness. Never forget. Never normalize.`;
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
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteUrl,
      siteName: "The Trump Files",
      title,
      description,
      images: [
        {
          url: "/images/og-image-2.png",
          width: 1200,
          height: 630,
          alt: `The Trump Files - ${entryCount}+ Documented Incidents`,
          type: "image/png",
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/og-image-2.png"],
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
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <meta name="theme-color" content="#FF6500" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Tianji Analytics */}
        <Script
          async
          defer
          src="https://tianji.p5n.lol/tracker.js"
          data-website-id="cmkknj04j0001fiaeb33fvmi7"
          strategy="afterInteractive"
        />

        {/* Matomo Analytics */}
        <Script id="matomo-analytics" strategy="afterInteractive">
          {`
            var _paq = window._paq = window._paq || [];
            _paq.push(["setDocumentTitle", document.domain + "/" + document.title]);
            _paq.push(["setDomains", ["*.trumpfiles.fun","*.www.trumpfiles.fun"]]);
            _paq.push(["enableCrossDomainLinking"]);
            _paq.push(['trackPageView']);
            _paq.push(['enableLinkTracking']);
            (function() {
              var u="//matomo.p5n.lol/";
              _paq.push(['setTrackerUrl', u+'matomo.php']);
              _paq.push(['setSiteId', '7']);
              var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
              g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
            })();
          `}
        </Script>

        {/* Matomo noscript fallback */}
        <noscript>
          <img
            referrerPolicy="no-referrer-when-downgrade"
            src="//matomo.p5n.lol/matomo.php?idsite=7&rec=1"
            style={{ border: 0 }}
            alt=""
          />
        </noscript>

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
      <body className={`
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
          font-sans antialiased min-h-screen bg-background
        `}>
        <AnimatedBackground>
          <BlobCursor />
          <Navigation />
          <main className="pt-16">
            {children}
          </main>
          <AsciiFooter />
        </AnimatedBackground>
      </body>
    </html>
  );
}