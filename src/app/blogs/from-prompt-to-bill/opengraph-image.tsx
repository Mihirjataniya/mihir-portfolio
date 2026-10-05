import { ImageResponse } from "next/og";
import { SITE } from "@/data/site";

/**
 * The post's own social card. Same reading-room palette as the page, not the
 * newspaper, so a shared link already looks like what it opens into.
 */
export const alt = "From Prompt to Bill: The Life of One LLM Call, by Mihir Jataniya";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#faf6ef";
const TEXT = "#2e2a23";
const SOFT = "#5a5246";
const MUTED = "#8c8270";
const LINE = "#e7dfd1";
const CHIP = "#f2ebdf";
const ACCENT = "#8a5a35";

const stages = ["tokens", "prefill", "decode", "sampling", "shape", "latency", "cost"];

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
          background: BG,
          color: TEXT,
          padding: "64px 72px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, color: ACCENT, letterSpacing: "0.04em" }}>
          Blog
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 96, fontWeight: 700, lineHeight: 1.05 }}>
            From Prompt to Bill
          </div>
          <div style={{ display: "flex", fontSize: 44, color: SOFT, marginTop: 18 }}>
            The life of one LLM call
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 44 }}>
            {stages.map((stage, i) => (
              <div key={stage} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {i > 0 ? <div style={{ display: "flex", color: MUTED, fontSize: 22 }}>→</div> : null}
                <div
                  style={{
                    display: "flex",
                    padding: "8px 14px",
                    borderRadius: 8,
                    background: CHIP,
                    color: SOFT,
                    fontSize: 22,
                    fontFamily: "monospace",
                  }}
                >
                  {stage}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: `1px solid ${LINE}`,
            paddingTop: 22,
            fontSize: 26,
            color: MUTED,
          }}
        >
          <div style={{ display: "flex" }}>{SITE.author}</div>
          <div style={{ display: "flex" }}>{SITE.url.replace("https://", "")}</div>
        </div>
      </div>
    ),
    size,
  );
}
