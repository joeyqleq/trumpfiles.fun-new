import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Navigation from "@/components/Navigation";
import "./globals.css";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "The Trump Files ::: Encyclopedia Orange",
  description: "An interactive thermal encyclopedia cataloging the most absurd events,lewd behaviors, and all straight-up WHAT THE FUCK moments and things uttered by the one and only orange narcissist, the phenomenon Donald J. Trump. This project is a goldmine collection of 370+ remarkable journal entried scraped, filtered  and  analysized by an army of AI bots and agents, then recreded as structured data, ijteractivev visualizations so that humanity never has the opportunity to forget or cast any doubt on all the comedy and pain this President Orange Blob Trump brought to the whole world.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },     
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <head>

  <link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96" />
  <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
  <link rel="shortcut icon" href="/favicon/favicon.ico" />
  <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
  <link rel="manifest" href="/favicon/site.webmanifest" />

  <Script id="matomo-tag-manager">
    {`
      var _mtm = window._mtm = window._mtm || [];
      _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
      (function() {
        var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
        g.async=true; g.src='https://matomo.motherfucking.fun/js/container_A7d3EtEf.js'; s.parentNode.insertBefore(g,s);
      })();
    `}
  </Script>

  <Script
    async
    defer 
    src="https://tianji.motherfucking.fun/tracker.js"
    data-website-id="cmh4cma6a4tg4wacz0fakjtx4"
  />
        </head>
        <body className={`${inter.variable} font-sans antialiased min-h-screen bg-background grid-background`}>
          <Navigation />
          <main className="pt-16">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
