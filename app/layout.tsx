import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import AsciiFooter from "@/components/AsciiFooter";
import "./globals.css";
import Script from "next/script";
import { arcticGuardian, arcticGuardian3D, arcticGuardianGrad, arcticGuardianGradItalic, arcticGuardianLaser, arcticGuardianLaserItalic, arcticGuardianHalf, arcticGuardianTwoTone, arcticGuardianTwoToneItalic, arcticGuardianLeft, neuething } from "./fonts";
import BlobCursor from "@/components/ui/BlobCursor";
import AnimatedBackground from "@/components/AnimatedBackground";

export const metadata: Metadata = {
  title: "The Trump Files ::: Encyclopedia Orange",
  description: "An interactive thermal encyclopedia cataloging the most absurd events, lewd behaviors, and all straight-up WHAT THE FUCK moments and things uttered by the one and only orange narcissist, the phenomenon Donald J. Trump. This project is a goldmine collection of 900+ remarkable journal entries scraped, filtered and analyzed by an army of AI bots and agents, then recreated as structured data, interactive visualizations so that humanity never has the opportunity to forget or cast any doubt on all the comedy and pain this President Orange Blob Trump brought to the whole world.",
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
  metadataBase: new URL("https://trumpfiles.fun")
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

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