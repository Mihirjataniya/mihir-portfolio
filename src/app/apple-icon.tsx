import { ImageResponse } from "next/og";

/**
 * Home-screen icon. Bigger than the tab favicon, so there is room for the
 * double rule and the wordmark underneath the letter.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          padding: 18,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 78,
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: "-0.03em",
          }}
        >
          MJ
        </div>

        <div style={{ width: 92, height: 6, background: "#8e2b1c", marginTop: 12 }} />

        <div
          style={{
            display: "flex",
            marginTop: 11,
            fontSize: 17,
            letterSpacing: "0.22em",
            color: "#8e8577",
          }}
        >
          STDOUT
        </div>
      </div>
    ),
    size,
  );
}
