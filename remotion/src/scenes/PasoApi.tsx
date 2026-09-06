import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from "remotion";
import { C, mono } from "../theme";
import { Aparece, Bloque, Encabezado, Pill } from "../components/Paso";

export type DatosPaso = {
  paso: string;
  sub: string;
  titulo: string;
  metodo: string;
  ruta: string;
  envio: string[];
  respuestaTitulo: string;
  respuesta: string[];
  tono?: string;
  quehacer: string;
};

export type Retrasos = { envio: number; respuesta: number; quehacer: number };

export const PasoApi: React.FC<{ datos: DatosPaso; display: string; retrasos?: Retrasos }> = ({
  datos,
  display,
  retrasos,
}) => {
  const r = retrasos ?? { envio: 20, respuesta: 40, quehacer: 56 };
  const frame = useCurrentFrame();
  const flecha = interpolate(frame, [r.respuesta - 8, r.respuesta + 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tono = datos.tono ?? C.teal;

  return (
    <AbsoluteFill
      style={{
        padding: "40px 72px 190px",
        justifyContent: "center",
        transform: `translateY(${Math.sin(frame / 40) * 3}px)`,
      }}
    >
      <Encabezado paso={datos.paso} sub={datos.sub} titulo={datos.titulo} display={display} />

      <Aparece delay={12} estilo={{ marginTop: 22 }}>
        <Pill metodo={datos.metodo} ruta={datos.ruta} />
      </Aparece>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 56px 1fr", alignItems: "center", gap: 8, marginTop: 22 }}>
        <Aparece delay={r.envio}>
          <Bloque titulo="Lo que envía" lineas={datos.envio} tono={C.muted} />
        </Aparece>
        <div style={{ textAlign: "center", opacity: flecha }}>
          <div style={{ height: 2, background: tono, width: interpolate(flecha, [0, 1], [0, 44]), margin: "0 auto" }} />
          <div style={{ fontFamily: mono, fontSize: 22, color: tono, marginTop: -14 }}>→</div>
        </div>
        <Aparece delay={r.respuesta}>
          <Bloque titulo={datos.respuestaTitulo} lineas={datos.respuesta} tono={tono} />
        </Aparece>
      </div>

      <Sequence from={r.quehacer} layout="none">
        <Aparece estilo={{ marginTop: 22 }}>
          <div
            style={{
              display: "inline-flex",
              gap: 12,
              alignItems: "baseline",
              border: `1px solid ${C.gold}55`,
              background: `${C.gold}12`,
              borderRadius: 4,
              padding: "12px 18px",
              maxWidth: 1040,
            }}
          >
            <span style={{ fontFamily: mono, fontSize: 14, color: C.gold, letterSpacing: 1.4 }}>QUÉ HACER</span>
            <span style={{ fontFamily: mono, fontSize: 21, color: C.text, lineHeight: 1.4 }}>{datos.quehacer}</span>
          </div>
        </Aparece>
      </Sequence>
    </AbsoluteFill>
  );
};
