"use client";

import Image from "next/image";
import { useState } from "react";
import { FileText } from "lucide-react";

const DOMAIN_LOGOS: Record<string, string> = {
  "abcnews.go.com": "abcnews-go-com.png",
  "aclu.org": "aclu-org.png",
  "ap.org": "apnews-com.png",
  "apnews.com": "apnews-com.png",
  "axios.com": "axios-com.png",
  "bbc.co.uk": "bbc-co-uk.png",
  "bbc.com": "bbc-com.png",
  "bloomberg.com": "bloomberg-com.png",
  "cbsnews.com": "cbsnews-com.png",
  "cnn.com": "cnn-com.png",
  "congress.gov": "congress-gov.png",
  "foxnews.com": "foxnews-com.png",
  "justice.gov": "justice-gov.png",
  "latimes.com": "latimes-com.png",
  "motherjones.com": "motherjones-com.png",
  "msnbc.com": "msnbc-com.png",
  "npr.org": "npr-org.png",
  "nytimes.com": "nytimes-com.png",
  "pbs.org": "pbs-org.png",
  "politico.com": "politico-com.png",
  "politifact.com": "politifact-com.png",
  "reuters.com": "reuters-com.png",
  "theatlantic.com": "theatlantic-com.png",
  "theguardian.com": "theguardian-com.png",
  "thehill.com": "thehill-com.png",
  "twitter.com": "twitter.png",
  "vox.com": "vox-com.png",
  "washingtonpost.com": "washingtonpost.png",
  "whitehouse.gov": "whitehouse-gov.png",
  "wsj.com": "wsj-com.png",
  "x.com": "twitter.png",
  "youtube.com": "youtube.png",
};

export function sourceDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^(www2?\.)/, "");
  } catch {
    return "Source";
  }
}

export function sourceDisplayName(publisher: string | null | undefined, url: string): string {
  if (publisher?.trim()) return publisher.trim();
  const domain = sourceDomain(url);
  if (domain === "Source") return domain;
  const stem = domain.split(".")[0];
  return stem.charAt(0).toUpperCase() + stem.slice(1);
}

function findLogo(domain: string): string | null {
  if (DOMAIN_LOGOS[domain]) return DOMAIN_LOGOS[domain];
  const parts = domain.split(".");
  if (parts.length > 2) {
    const base = parts.slice(-2).join(".");
    return DOMAIN_LOGOS[base] ?? null;
  }
  return null;
}

export function SourceBrand({
  url,
  publisher,
  size = 24,
}: {
  url: string;
  publisher?: string | null;
  size?: number;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const domain = sourceDomain(url);
  const logo = findLogo(domain);
  const name = sourceDisplayName(publisher, url);

  return (
    <span className="inline-flex min-w-0 items-center gap-2">
      <span
        className="grid shrink-0 place-items-center overflow-hidden rounded-md border border-white/10 bg-white/90"
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        {logo && !imageFailed ? (
          <Image
            src={`/brand_logos/${logo}`}
            alt=""
            width={size}
            height={size}
            className="h-full w-full object-contain p-0.5"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <FileText className="h-3.5 w-3.5 text-zinc-800" />
        )}
      </span>
      <span className="truncate">{name}</span>
    </span>
  );
}
