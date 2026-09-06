import { useCurrentFrame, interpolate } from "remotion";
import { C, mono } from "../theme";
import type { LineaGuion } from "../guion-tutorial";

export const Subtitulos: React.FC<{
  lineas: LineaGuion[];
  ancho?: number;
  tamano?: number;
  abajo?: number;
}> = ({ lineas, ancho = 1000, tamano = 26, abajo = 44 }) => {
  const frame = useCurrentFrame();
  const activa = lineas.find((l) => frame >= l.inicio - 3 && frame < l.inicio + l.dur + 8);
  if (!activa) return null;
  const opacidad = interpolate(
    frame,
    [activa.inicio - 3, activa.inicio + 4, activa.inicio + activa.dur + 2, activa.inicio + activa.dur + 8],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: abajo,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        opacity: opacidad,
      }}
    >
      <div
        style={{
          maxWidth: ancho,
          background: "rgba(11,16,26,0.88)",
          border: `1px solid ${C.line}88`,
          borderRadius: 6,
          padding: `${Math.round(tamano * 0.5)}px ${Math.round(tamano * 0.9)}px`,
          fontFamily: mono,
          fontSize: tamano,
          lineHeight: 1.45,
          color: C.text,
          textAlign: "center",
        }}
      >
        {activa.texto}
      </div>
    </div>
  );
};
