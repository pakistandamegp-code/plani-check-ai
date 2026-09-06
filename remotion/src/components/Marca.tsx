import { Img, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { C, mono } from "../theme";

export const LOGO = "images/logo.png";

/** Logo grande + nombre, para portadas y cierres. */
export const Marca: React.FC<{ display: string; tamano?: number; delay?: number; sub?: string }> = ({
  display,
  tamano = 96,
  delay = 0,
  sub = "PREVALIDACIÓN DE PLANILLAS · PANAMÁ",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 120 } });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: tamano * 0.3,
        opacity: s,
        transform: `translateY(${interpolate(s, [0, 1], [22, 0])}px)`,
      }}
    >
      <div
        style={{
          width: tamano,
          height: tamano,
          borderRadius: tamano * 0.24,
          background: "#ffffff",
          border: `1px solid ${C.line}`,
          padding: tamano * 0.1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 10px 30px rgba(0,0,0,0.35)`,
        }}
      >
        <Img src={staticFile(LOGO)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>
      <div>
        <div
          style={{
            fontFamily: display,
            fontWeight: 700,
            fontSize: tamano * 0.46,
            letterSpacing: -tamano * 0.012,
            color: C.text,
            lineHeight: 1.05,
          }}
        >
          Prevalida Planillas
        </div>
        <div style={{ fontFamily: mono, fontSize: tamano * 0.19, letterSpacing: 2, color: C.teal, marginTop: 6 }}>
          {sub}
        </div>
      </div>
    </div>
  );
};

/** Marca de agua permanente en una esquina. */
export const MarcaAgua: React.FC<{ display: string; escala?: number }> = ({ display, escala = 1 }) => (
  <div
    style={{
      position: "absolute",
      top: 30 * escala,
      right: 34 * escala,
      display: "flex",
      alignItems: "center",
      gap: 12 * escala,
      opacity: 0.9,
    }}
  >
    <div
      style={{
        fontFamily: display,
        fontWeight: 700,
        fontSize: 20 * escala,
        color: C.text,
        opacity: 0.75,
        letterSpacing: -0.4,
      }}
    >
      Prevalida Planillas
    </div>
    <div
      style={{
        width: 40 * escala,
        height: 40 * escala,
        borderRadius: 10 * escala,
        background: "#ffffff",
        border: `1px solid ${C.line}`,
        padding: 4 * escala,
        display: "flex",
      }}
    >
      <Img src={staticFile(LOGO)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
    </div>
  </div>
);
