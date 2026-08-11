import { ImageResponse } from "next/og";
import { sql } from "@/lib/neonClient";
import { readFile } from "fs/promises";
import { join } from "path";

export const runtime = "nodejs";
export const alt = "The Trump Files — Encyclopedia Orange";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function getEntryCount(): Promise<number> {
  try {
    const result = await sql`SELECT COUNT(*) as count FROM ai_complete_trump_data`;
    return parseInt(result[0]?.count || "6000", 10);
  } catch {
    return 6000;
  }
}

async function getLogoData(): Promise<string> {
  try {
    const logoPath = join(process.cwd(), "public", "logos", "trumpfiles_orange_logo.png");
    const data = await readFile(logoPath);
    return `data:image/png;base64,${data.toString("base64")}`;
  } catch {
    return "";
  }
}

export default async function Image() {
  const [count, logoSrc] = await Promise.all([getEntryCount(), getLogoData()]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#060608",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,101,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,101,0,0.05) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        {/* Orange radial glow — bottom left */}
        <div
          style={{
            position: "absolute",
            bottom: "-120px",
            left: "-120px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,101,0,0.18) 0%, transparent 65%)",
          }}
        />

        {/* Mint glow — top right */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(62,230,193,0.08) 0%, transparent 65%)",
          }}
        />

        {/* Content column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "28px",
            zIndex: 10,
          }}
        >
          {/* Logo */}
          {logoSrc && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoSrc}
              alt="The Trump Files"
              width={220}
              height={220}
              style={{ objectFit: "contain", filter: "drop-shadow(0 0 32px rgba(255,101,0,0.5))" }}
            />
          )}

          {/* Entry count */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "10px",
            }}
          >
            <span
              style={{
                fontSize: "96px",
                fontWeight: 900,
                color: "#FF6500",
                lineHeight: 1,
                letterSpacing: "-0.04em",
              }}
            >
              {count.toLocaleString()}+
            </span>
            <span
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "rgba(255,255,255,0.45)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}
            >
              documented
            </span>
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "rgba(255,255,255,0.80)",
              letterSpacing: "0.06em",
              textAlign: "center",
              textTransform: "uppercase",
              maxWidth: "700px",
            }}
          >
            Beat the flood. Keep the receipts.
          </div>

          {/* Sub-tagline */}
          <div
            style={{
              fontSize: "15px",
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            trumpstein.me
          </div>
        </div>

        {/* Bottom score pills */}
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            display: "flex",
            gap: "16px",
          }}
        >
          {["Danger", "Lawlessness", "Insanity", "Absurdity", "Authoritarianism"].map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                color: "rgba(255,255,255,0.3)",
                fontSize: "12px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              <div
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: "#FF6500",
                  opacity: 0.6,
                }}
              />
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
