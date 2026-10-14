import { Inter, Source_Serif_4 } from "next/font/google";

/**
 * Reading fonts for blog posts, defined once and imported by every post.
 * next/font hosts one instance per call, so declaring the same font in each
 * post file breaks the build.
 */
export const reading = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-reading",
  display: "swap",
});

export const ui = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ui",
  display: "swap",
});
