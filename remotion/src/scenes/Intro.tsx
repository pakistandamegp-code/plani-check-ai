import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { C, mono } from "../theme";
import { Aparece } from "../components/Paso";
import { Marca } from "../components/Marca";

export const Intro: React.FC<{ display: string }> = ({ display }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const linea = spring({ frame: frame - 8, fps, config: { damping: 200 } });
  const flota = Math.sin(frame / 22) * 4;

  return (
    <AbsoluteFill style={{ padding: "0 96px 150px", justifyContent: "center" }}>
      <div style={{ transform: `translateY(${flota}px)` }}>
        <Marca display={display} tamano={104} />
        <Aparece delay={6}>
          <h1
            style={{
              fontFamily: display,
              fontSize: 74,
              fontWeight: 700,
              letterSpacing: -3,
              lineHeight: 0.98,
              color: C.text,
              margin: "18px 0 0",
            }}
          >
            Nuestras dos APIs,
            <br />
            paso a paso
          </h1>
        </Aparece>
        <div
          style={{
            height: 4,
            marginTop: 26,
            width: interpolate(linea, [0, 1], [0, 460]),
            background: `linear-gradient(90deg, ${C.teal}, ${C.gold})`,
          }}
        />
        <Aparece delay={22}>
          <p style={{ fontFamily: mono, fontSize: 24, color: C.muted, marginTop: 24 }}>
2 APIs · 5 controles de seguridad · qué hacer con cada error
          </p>
        </Aparece>
      </div>
    </AbsoluteFill>
  );
};
