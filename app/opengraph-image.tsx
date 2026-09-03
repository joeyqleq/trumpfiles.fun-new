import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const runtime = "nodejs";
export const alt = "Trumpstein: Encyclopedia Orange — Trumpstein Files heritage archive";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function publicAssetData(path: string, mimeType: string): Promise<string> {
  try {
    const data = await readFile(join(process.cwd(), "public", path));
    return `data:${mimeType};base64,${data.toString("base64")}`;
  } catch {
    return "";
  }
}

async function displayFontData(): Promise<ArrayBuffer | undefined> {
  try {
    const font = await readFile(join(process.cwd(), "public", "fonts", "Arctic_Guardian", "arcticguardiangrad.ttf"));
    return font.buffer.slice(font.byteOffset, font.byteOffset + font.byteLength) as ArrayBuffer;
  } catch {
    return undefined;
  }
}

export default async function Image() {
  const [legacyLogo, kippah, displayFont] = await Promise.all([
    publicAssetData("logos/trumpfiles_orange_logo.png", "image/png"),
    publicAssetData("trumpstein_kippah.svg", "image/svg+xml"),
    displayFontData(),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#080706",
          color: "#fff7ed",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 10% 20%, rgba(255,101,0,0.3), transparent 31%), radial-gradient(circle at 88% 90%, rgba(212,60,0,0.22), transparent 30%)" }} />

        <div style={{ display: "flex", alignItems: "center", width: "100%", padding: "68px 88px", gap: "70px" }}>
          <div style={{ display: "flex", position: "relative", width: "330px", height: "390px", alignItems: "center", justifyContent: "center" }}>
            {legacyLogo ? <img src={legacyLogo} width={310} height={310} alt="Trumpstein Files legacy logo" style={{ objectFit: "contain" }} /> : null}
            {kippah ? <img src={kippah} width={190} height={111} alt="Trumpstein kippah" style={{ position: "absolute", top: "17px", left: "70px", objectFit: "contain", transform: "rotate(-4deg)" }} /> : null}
          </div>

          <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: "18px" }}>
            <div style={{ display: "flex", fontSize: "17px", fontWeight: 700, letterSpacing: "0.18em", color: "#ffbd7a", textTransform: "uppercase" }}>Trumpstein Files heritage archive</div>
            <div style={{ display: "flex", fontFamily: "Arctic Guardian", fontSize: "82px", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 0.94 }}><span style={{ display: "flex", color: "#ffd08a" }}>TRUMP</span><span style={{ display: "flex", color: "#ff5000" }}>STEIN</span></div>
            <div style={{ display: "flex", fontSize: "32px", fontWeight: 700, letterSpacing: "0.18em", color: "#ffc28d", textTransform: "uppercase" }}>Encyclopedia Orange</div>
            <div style={{ display: "flex", maxWidth: "570px", fontSize: "24px", lineHeight: 1.35, color: "rgba(255,247,237,0.82)" }}>A source-aware archive of documented incidents, statements, relationships, and consequences.</div>
            <div style={{ display: "flex", alignItems: "center", marginTop: "12px", gap: "14px" }}>
              <span style={{ display: "flex", padding: "11px 20px", borderRadius: "999px", backgroundColor: "#ff6500", color: "#170b04", fontSize: "26px", fontWeight: 900, letterSpacing: "0.02em" }}>7K+</span>
              <span style={{ display: "flex", fontSize: "16px", fontWeight: 700, letterSpacing: "0.13em", color: "rgba(255,247,237,0.56)", textTransform: "uppercase" }}>archive records</span>
            </div>
            <div style={{ display: "flex", marginTop: "8px", fontSize: "15px", fontWeight: 700, letterSpacing: "0.2em", color: "rgba(255,247,237,0.4)", textTransform: "uppercase" }}>trumpstein.me</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: displayFont ? [{ name: "Arctic Guardian", data: displayFont, weight: 400, style: "normal" }] : [],
    },
  );
}
