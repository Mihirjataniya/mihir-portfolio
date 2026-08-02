import { ImageResponse } from "next/og";
import { SITE } from "@/data/site";

/**
 * The social card, drawn at build time rather than kept as a checked-in asset,
 * so it cannot go stale against the masthead.
 *
 * Deliberately no custom fonts: pulling the display face in would mean shipping
 * a font buffer to the renderer, and the card reads as the paper from the ink
 * colours, the rules and the letter spacing alone.
 */
export const alt = `${SITE.name}, a personal engineering newspaper by ${SITE.author}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "#f1ede3";
const INK = "#14120f";
const INK_MUTE = "#6b655b";
const ACCENT = "#8e2b1c";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: PAPER,
          color: INK,
          padding: "56px 64px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ height: 8, background: INK }} />
          <div style={{ height: 2, background: INK, marginTop: 5 }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div
            style={{
              fontSize: 168,
              fontWeight: 700,
              letterSpacing: "0.02em",
              lineHeight: 1,
              display: "flex",
            }}
          >
            {SITE.name}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 30 }}>
            <div style={{ width: 150, height: 1, background: INK }} />
            <div
              style={{
                fontSize: 27,
                letterSpacing: "0.06em",
                color: INK_MUTE,
                display: "flex",
              }}
            >
              a personal engineering newspaper
            </div>
            <div style={{ width: 150, height: 1, background: INK }} />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ height: 2, background: INK, marginBottom: 16 }} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              fontSize: 27,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            <div style={{ display: "flex" }}>
              Published by&nbsp;<span style={{ color: ACCENT }}>{SITE.author}</span>
            </div>
            <div style={{ color: INK_MUTE, display: "flex" }}>Ahmedabad, India</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
