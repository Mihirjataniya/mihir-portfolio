import { ImageResponse } from "next/og";

/**
 * Browser tab icon, drawn rather than checked in.
 *
 * Two letters at 16px is already at the edge of legible, so this is the initials
 * and nothing else: tracking pulled tight, filling the frame, paper on ink. The
 * accent rule that the home-screen icon carries is dropped here because at a
 * quarter of this size it renders as one muddy row of pixels and steals height
 * the letters need. No custom font either, since shipping a font buffer to draw
 * two glyphs is not worth the build weight.
 */
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#14120f",
          color: "#f1ede3",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 42,
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: "-0.05em",
          }}
        >
          MJ
        </div>
      </div>
    ),
    size,
  );
}
