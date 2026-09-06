import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { C, mono } from "../theme";
import { Aparece, Encabezado } from "../components/Paso";

export const HallazgoScene: React.FC<{ display: string; retrasos?: { alerta: number; nota: number } }> = ({
  display,
  retrasos,
}) => (
  <Contenido display={display} retrasos={retrasos} />
);

const Contenido: React.FC<{ display: string; retrasos?: { alerta: number; nota: number } }> = ({
  display,
  retrasos,
}) => (
  <AbsoluteFill
    style={{
      padding: "40px 72px 190px",
      justifyContent: "center",
      transform: `translateY(${Math.sin(useCurrentFrame() / 40) * 3}px)`,
    }}
  >
    <Encabezado
      paso="PASO 4"
      sub="GET /api/v1/validacion/planillas/{id}/hallazgos"
      titulo="Leer el resultado, hallazgo por hallazgo"
      display={display}
    />

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 26 }}>
      <Aparece delay={14}>
        <div
          style={{
            border: `1px solid ${C.error}55`,
            borderLeft: `5px solid ${C.error}`,
            background: C.surface,
            borderRadius: 4,
            padding: "18px 20px",
          }}
        >
          <div style={{ fontFamily: mono, fontSize: 14, color: C.error, letterSpacing: 1.4 }}>
            ERROR BLOQUEANTE · REG-IDE-002 · FILA 4
          </div>
          <div style={{ fontFamily: mono, fontSize: 20, color: C.text, marginTop: 12, lineHeight: 1.45 }}>
            numero_documento no cumple el
            <br />
            formato de PASAPORTE
          </div>
          <div style={{ fontFamily: mono, fontSize: 18, color: C.muted, marginTop: 12 }}>
            valor recibido: <span style={{ color: C.error }}>"8-742-118"</span>
          </div>
        </div>
      </Aparece>

      <Aparece delay={retrasos?.alerta ?? 30}>
        <div
          style={{
            border: `1px solid ${C.gold}55`,
            borderLeft: `5px solid ${C.gold}`,
            background: C.surface,
            borderRadius: 4,
            padding: "18px 20px",
          }}
        >
          <div style={{ fontFamily: mono, fontSize: 14, color: C.gold, letterSpacing: 1.4 }}>
            ALERTA · REG-SAL-001 · FILA 2
          </div>
          <div style={{ fontFamily: mono, fontSize: 20, color: C.text, marginTop: 12, lineHeight: 1.45 }}>
            viáticos superan el 25 % del
            <br />
            sueldo declarado
          </div>
          <div style={{ fontFamily: mono, fontSize: 18, color: C.muted, marginTop: 12 }}>
            valor recibido: <span style={{ color: C.gold }}>B/. 420.00</span>
          </div>
        </div>
      </Aparece>
    </div>

    <Sequence from={retrasos?.nota ?? 52} layout="none">
      <Aparece estilo={{ marginTop: 24 }}>
        <div style={{ display: "flex", gap: 16, fontFamily: mono, fontSize: 20 }}>
          <span style={{ color: C.error }}>ERROR → se corrige</span>
          <span style={{ color: C.muted }}>|</span>
          <span style={{ color: C.gold }}>ALERTA → se confirma con justificación</span>
        </div>
      </Aparece>
    </Sequence>
  </AbsoluteFill>
);
