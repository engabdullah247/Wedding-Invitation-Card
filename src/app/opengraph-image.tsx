import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const alt = "M & S — Wedding Invitation, Friday 11 December 2026";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fontDir = path.join(process.cwd(), "node_modules/@fontsource/cormorant-garamond/files");

export default async function Image() {
  const [semi, italic] = await Promise.all([
    readFile(path.join(fontDir, "cormorant-garamond-latin-600-normal.woff")),
    readFile(path.join(fontDir, "cormorant-garamond-latin-500-italic.woff")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at 50% 30%, #6a2742 0%, #3b1424 70%, #2a0c19 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: 1080,
            height: 510,
            border: "2px solid #c9a465",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 210,
              height: 210,
              borderRadius: 105,
              border: "3px solid #c9a465",
              color: "#e6cb93",
              fontFamily: "Cormorant",
              fontSize: 92,
              fontWeight: 600,
            }}
          >
            M &amp; S
          </div>
          <div
            style={{
              marginTop: 34,
              display: "flex",
              color: "#fbf6ee",
              fontFamily: "CormorantItalic",
              fontSize: 54,
            }}
          >
            You are invited to our wedding
          </div>
          <div style={{ marginTop: 14, display: "flex", color: "#e6cb93", fontFamily: "Cormorant", fontSize: 40 }}>
            Friday, 11 December 2026
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Cormorant", data: semi, weight: 600, style: "normal" },
        { name: "CormorantItalic", data: italic, weight: 500, style: "italic" },
      ],
    },
  );
}
