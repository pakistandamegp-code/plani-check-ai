import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { C, mono } from "../theme";
import { Aparece, Encabezado } from "../components/Paso";

const CONTROLES = [
  {
    n: "01",
    t: "El empleador lo fija el servidor",
    d: "La sesión decide qué empresa se puede ver. El cliente no puede pedir la planilla de otra.",
  },
  {
    n: "02",
    t: "Solo CSV UTF-8, con límite de tamaño",
    d: "Se rechaza cualquier otro tipo de archivo antes de leer una sola fila.",
  },
  {
    n: "03",
    t: "Cada celda se sanea al recibirla",
    d: "Se neutralizan fórmulas, HTML y caracteres de control: nada ejecutable entra al sistema.",
  },
  {
    n: "04",
    t: "Idempotencia e IDs de 128 bits",
    d: "El mismo envío repetido no duplica la planilla y los identificadores no se pueden adivinar.",
  },
  {
    n: "05",
    t: "Bitácora de auditoría completa",
    d: "Actor, fecha, acción y resultado quedan registrados en cada carga, corrección y validación.",
  },
];

export const Seguridad: React.FC<{ display: string }> = ({ display }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        padding: "20px 72px 190px",
        justifyContent: "center",
        transform: `translateY(${Math.sin(frame / 44) * 3}px)`,
      }}
    >
      <div style={{ maxWidth: 950 }}>
      <Encabezado
        paso="SEGURIDAD"
        sub="APLICA A LAS DOS APIS"
        titulo="Cinco controles de seguridad"
        display={display}
      />
      </div>

      <div style={{ marginTop: 14 }}>
        {CONTROLES.map((c, i) => {
          const delay = 12 + i * 16;
          const linea = interpolate(frame, [delay, delay + 14], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <Aparece key={c.n} delay={delay} desde={16} estilo={{ marginBottom: 8 }}>
              <div
                style={{
                  display: "flex",
                  gap: 18,
                  alignItems: "flex-start",
                  background: C.surface,
                  border: `1px solid ${C.line}55`,
                  borderRadius: 4,
                  padding: "10px 18px",
                }}
              >
                <span style={{ fontFamily: mono, fontSize: 20, color: C.teal, opacity: 0.9 }}>{c.n}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: display, fontWeight: 700, fontSize: 21, color: C.text }}>{c.t}</div>
                  <div style={{ fontFamily: mono, fontSize: 16, color: C.muted, marginTop: 3 }}>{c.d}</div>
                </div>
                <div
                  style={{
                    marginLeft: "auto",
                    alignSelf: "center",
                    width: 54,
                    height: 6,
                    borderRadius: 3,
                    background: `${C.line}66`,
                  }}
                >
                  <div style={{ width: `${linea * 100}%`, height: 6, borderRadius: 3, background: C.ok }} />
                </div>
              </div>
            </Aparece>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
