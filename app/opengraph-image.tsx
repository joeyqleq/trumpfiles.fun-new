import { ImageResponse } from "next/og";
import { sql } from "@/lib/neonClient";

export const runtime = "nodejs";
export const alt = "The Trump Files — Encyclopedia Orange";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function getEntryCount(): Promise<number> {
  try {
    const result = await sql`SELECT COUNT(*) as count FROM ai_complete_trump_data`;
    return parseInt(result[0]?.count || "1100", 10);
  } catch {
    return 1100;
  }
}

export default async function Image() {
  const count = await getEntryCount();

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#0a0a0a",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 72px",
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
              "linear-gradient(rgba(255,101,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,101,0,0.06) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Orange glow blob */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "480px",
            height: "480px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,101,0,0.25) 0%, transparent 70%)",
          }}
        />

        {/* Top: logo + label */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              background: "#FF6500",
              color: "#fff",
              fontWeight: 900,
              fontSize: "14px",
              letterSpacing: "0.15em",
              padding: "6px 14px",
              borderRadius: "4px",
              textTransform: "uppercase",
            }}
          >
            🗂 The Trump Files
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: "13px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            trumpfiles.fun
          </div>
        </div>

        {/* Center: big count + headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "12px",
            }}
          >
            <span
              style={{
                fontSize: "120px",
                fontWeight: 900,
                color: "#FF6500",
                lineHeight: 1,
                letterSpacing: "-0.03em",
              }}
            >
              {count.toLocaleString()}
            </span>
            <span
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: "rgba(255,255,255,0.5)",
                marginBottom: "12px",
              }}
            >
              documented incidents
            </span>
          </div>

          <div
            style={{
              fontSize: "36px",
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.2,
              maxWidth: "720px",
            }}
          >
            Encyclopedia Orange
          </div>
          <div
            style={{
              fontSize: "20px",
              color: "rgba(255,255,255,0.55)",
              maxWidth: "680px",
              lineHeight: 1.5,
            }}
          >
            AI-scored, source-linked, and timestamped. The internet's most
            comprehensive catalog of Trump-era misconduct.
          </div>
        </div>

        {/* Bottom: score labels */}
        <div style={{ display: "flex", gap: "24px" }}>
          {["Danger", "Lawlessness", "Insanity", "Absurdity", "Authoritarianism"].map(
            (label) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "13px",
                  letterSpacing: "0.08em",
                }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#FF6500",
                    opacity: 0.7,
                  }}
                />
                {label}
              </div>
            )
          )}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
