import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Navigation from "@/components/Navigation";
import AsciiFooter from "@/components/AsciiFooter";
import "./globals.css";
import Script from "next/script";
import { arcticGuardian, arcticGuardian3D, arcticGuardianGrad, arcticGuardianLaser, arcticGuardianHalf, arcticGuardianTwoTone, arcticGuardianLeft, neuething } from "./fonts";
import BlobCursor from "@/components/ui/BlobCursor";
export const metadata: Metadata = {
  title: "The Trump Files ::: Encyclopedia Orange",
  description: "An interactive thermal encyclopedia cataloging the most absurd events, lewd behaviors, and all straight-up WHAT THE FUCK moments and things uttered by the one and only orange narcissist, the phenomenon Donald J. Trump. This project is a goldmine collection of 370+ remarkable journal entries scraped, filtered and analyzed by an army of AI bots and agents, then recreated as structured data, interactive visualizations so that humanity never has the opportunity to forget or cast any doubt on all the comedy and pain this President Orange Blob Trump brought to the whole world.",
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
  return <ClerkProvider data-oid=".s0fbp1">
      <html lang="en" className="dark" data-oid="zksrn.l">
        <head data-oid="07:6u-c">
          <meta name="viewport" content="width=device-width, initial-scale=1.0" data-oid="t7rm-0k" />

          <Script id="matomo-tag-manager" data-oid="nrltwfv">
            {`
              var _mtm = window._mtm = window._mtm || [];
              _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
              (function() {
                var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                g.async=true; g.src='https://matomo.motherfucking.fun/js/container_A7d3EtEf.js'; s.parentNode.insertBefore(g,s);
              })();
            `}
          </Script>

          <Script async defer src="https://tianji.motherfucking.fun/tracker.js" data-website-id="cmh4cma6a4tg4wacz0fakjtx4" data-oid="ck3r8i1" />
        </head>
        <body className={`
          ${arcticGuardian.variable} 
          ${arcticGuardian3D.variable}
          ${arcticGuardianGrad.variable}
          ${arcticGuardianLaser.variable}
          ${arcticGuardianHalf.variable}
          ${arcticGuardianTwoTone.variable}
          ${arcticGuardianLeft.variable}
          ${neuething.variable} 
          font-sans antialiased min-h-screen bg-background grid-background
        `} data-oid="xpruuu3">
          <BlobCursor />
          <Navigation data-oid="17ec3t2" />
          <main className="pt-16" data-oid="ps7wmi3">
            {children}
          </main>
          <AsciiFooter />
        </body>
      </html>
    </ClerkProvider>;
}