import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { C, mono } from "../theme";
import { Aparece } from "../components/Paso";
import { Marca } from "../components/Marca";

export const Cierre: React.FC<{ display: string }> = ({ display }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sello = spring({ frame: frame - 26, fps, config: { damping: 11, stiffness: 140 } });
  const flota = Math.sin(frame / 20) * 3;

  return (
    <AbsoluteFill style={{ padding: "0 90px 150px", justifyContent: "center" }}>
      <div style={{ transform: `translateY(${flota}px)` }}>
        <Marca display={display} tamano={80} sub="EL CICLO COMPLETO" />
        <Aparece delay={6}>
          <h1
            style={{
              fontFamily: display,
              fontSize: 68,
              fontWeight: 700,
              letterSpacing: -2,
              lineHeight: 1.02,
              color: C.text,
              margin: "16px 0 0",
            }}
          >
            Corrija, revalide y repita
            <br />
            hasta llegar a
          </h1>
        </Aparece>
        <div
          style={{
            marginTop: 22,
            display: "inline-block",
            transform: `scale(${interpolate(sello, [0, 1], [0.7, 1])})`,
            opacity: sello,
            border: `2px solid ${C.ok}`,
            background: `${C.ok}18`,
            borderRadius: 4,
            padding: "14px 26px",
            fontFamily: mono,
            fontSize: 40,
            letterSpacing: 2,
            color: C.ok,
          }}
        >
          PREVALIDADA
        </div>
        <Sequence from={54} layout="none">
          <Aparece estilo={{ marginTop: 30 }}>
            <p style={{ fontFamily: mono, fontSize: 22, color: C.muted, lineHeight: 1.6 }}>
              Dos APIs · cinco controles de seguridad · cada error explicado
              <br />
              con el paso exacto para arreglarlo, también en
              <span style={{ color: C.teal }}> /demo/errores</span>.
            </p>
          </Aparece>
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};
