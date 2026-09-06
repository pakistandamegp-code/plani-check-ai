import { useCurrentFrame, useVideoConfig, spring, interpolate, Sequence } from "remotion";
import { C, mono } from "../theme";

export const Aparece: React.FC<{
  delay?: number;
  desde?: number;
  children: React.ReactNode;
  estilo?: React.CSSProperties;
}> = ({ delay = 0, desde = 26, children, estilo }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 22, stiffness: 130 } });
  const y = interpolate(s, [0, 1], [desde, 0]);
  return (
    <div style={{ opacity: s, transform: `translateY(${y}px)`, ...estilo }}>{children}</div>
  );
};

export const Pill: React.FC<{ metodo: string; ruta: string }> = ({ metodo, ruta }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      border: `1px solid ${C.teal}55`,
      background: `${C.teal}14`,
      borderRadius: 4,
      padding: "10px 16px",
      fontFamily: mono,
      fontSize: 21,
      color: C.text,
    }}
  >
    <span style={{ color: C.ink, background: C.teal, borderRadius: 3, padding: "2px 8px", fontWeight: 700, fontSize: 17 }}>
      {metodo}
    </span>
    <span>{ruta}</span>
  </div>
);

export const Bloque: React.FC<{
  titulo: string;
  tono?: string;
  lineas: string[];
  ancho?: number;
}> = ({ titulo, tono = C.line, lineas, ancho }) => (
  <div
    style={{
      border: `1px solid ${tono}66`,
      borderLeft: `4px solid ${tono}`,
      background: C.surface,
      borderRadius: 4,
      padding: "16px 20px",
      width: ancho,
      minWidth: 0,
    }}
  >
    <div style={{ fontFamily: mono, fontSize: 14, letterSpacing: 1.2, color: tono, textTransform: "uppercase" }}>
      {titulo}
    </div>
    <div style={{ marginTop: 10 }}>
      {lineas.map((l, i) => (
        <Sequence key={i} from={0} layout="none">
          <div
            style={{
              fontFamily: mono,
              fontSize: 19,
              lineHeight: 1.6,
              color: l.startsWith("//") ? C.muted : C.text,
              whiteSpace: "pre",
            }}
          >
            {l}
          </div>
        </Sequence>
      ))}
    </div>
  </div>
);

export const Encabezado: React.FC<{
  paso: string;
  titulo: string;
  sub: string;
  display: string;
}> = ({ paso, titulo, sub, display }) => (
  <>
    <Aparece>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span
          style={{
            fontFamily: mono,
            fontSize: 16,
            color: C.gold,
            border: `1px solid ${C.gold}66`,
            borderRadius: 3,
            padding: "4px 10px",
          }}
        >
          {paso}
        </span>
        <span style={{ fontFamily: mono, fontSize: 15, color: C.muted, letterSpacing: 2 }}>{sub}</span>
      </div>
    </Aparece>
    <Aparece delay={5}>
      <h1
        style={{
          fontFamily: display,
          fontSize: 54,
          fontWeight: 700,
          color: C.text,
          margin: "14px 0 0",
          letterSpacing: -1.2,
          lineHeight: 1.05,
        }}
      >
        {titulo}
      </h1>
    </Aparece>
  </>
);
