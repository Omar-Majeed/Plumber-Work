import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { business, profile } from "@/content/business";

export const runtime = "nodejs";
export const alt = `${business.displayName} — ${business.descriptor}, ${business.address.locality}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Branded Open Graph card.
 *
 * The logo is read from `public/brand/` at render time and inlined as a data
 * URI — `next/og` cannot resolve site-relative image paths, and this keeps the
 * card in step with the brand asset instead of duplicating it in code.
 */
export default async function OpengraphImage() {
  const logo = await readFile(
    join(process.cwd(), "public", "brand", "hohmanns-logo-inverse.png"),
  );
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px",
        background:
          "linear-gradient(135deg, #123656 0%, #0B2036 55%, #071827 100%)",
        color: "#FFFFFF",
        fontFamily: "sans-serif",
      }}
    >
      {/* next/og renders to a static image, so a plain <img> is correct. */}
      <img src={logoSrc} alt="" width={420} height={95} />

      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        <div
          style={{
            fontSize: "18px",
            letterSpacing: "6px",
            color: "#17B8AA",
            textTransform: "uppercase",
          }}
        >
          {`${business.address.locality}, Queensland`}
        </div>
        <div style={{ fontSize: "62px", lineHeight: 1.05, maxWidth: "900px" }}>
          Rockhampton plumbing, without the runaround.
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          fontSize: "28px",
        }}
      >
        <div
          style={{
            display: "flex",
            background: "#F66A2B",
            color: "#071827",
            padding: "14px 26px",
            borderRadius: "12px",
            fontWeight: 600,
          }}
        >
          {business.phone.display}
        </div>
        <div style={{ display: "flex", color: "#FFFFFF", opacity: 0.7 }}>
          {profile.hoursSummary}
        </div>
      </div>
    </div>,
    size,
  );
}
