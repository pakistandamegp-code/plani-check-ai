import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { C, mono } from "../theme";
import { Aparece, Encabezado } from "../components/Paso";

const ATAQUES = [
  { t: "Pedir la planilla de otra empresa", d: "Cambiar el empleador en la petición para leer datos ajenos." },
  { t: "CSV con fórmulas escondidas", d: "Celdas tipo =CMD() que se ejecutan al abrir el archivo en Excel." },
  { t: "Repetir el mismo envío", d: "Reintentos que duplicarían la planilla y sus registros." },
  { t: "Adivinar identificadores", d: "Probar IDs correlativos para llegar a planillas de terceros." },
  { t: "Alterar una versión ya presentada", d: "Reescribir el historial para tapar un dato corregido." },
  { t: "Saturar con cargas enormes", d: "Archivos gigantes o miles de envíos para tumbar el servicio." },
];

const DEFENSAS = [
  { t: "El empleador lo fija el servidor", d: "Sale de la sesión: el cliente no elige qué empresa ve." },
  { t: "Saneamiento de cada celda", d: "Fórmulas, HTML y caracteres de control se neutralizan al recibir." },
  { t: "Llave de idempotencia", d: "El mismo envío repetido no crea una planilla nueva." },
  { t: "Identificadores de 128 bits", d: "Aleatorios y no correlativos: no se pueden adivinar." },
  { t: "Versionado inmutable", d: "Cada corrección crea una versión nueva; nada se sobrescribe." },
  { t: "Límite de tamaño y bitácora", d: "Solo CSV UTF-8 acotado, y actor, fecha y resultado quedan registrados." },
];

const Lista: React.FC<{
  datos: { t: string; d: string }[];
  color: string;
  marca: string;
  display: string;
}> = ({ datos, color, marca, display }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      {datos.map((c, i) => {
        const delay = 12 + i * 13;
        const barra = interpolate(frame, [delay, delay + 16], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <Aparece key={c.t} delay={delay} desde={16}>
            <div
              style={{
                background: C.surface,
                border: `1px solid ${C.line}55`,
                borderLeft: `4px solid ${color}`,
                borderRadius: 4,
                padding: "12px 16px",
                height: "100%",
              }}
            >
              <div style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
                <span style={{ fontFamily: mono, fontSize: 18, color }}>{marca}</span>
                <span style={{ fontFamily: display, fontWeight: 700, fontSize: 20, color: C.text }}>{c.t}</span>
              </div>
              <div style={{ fontFamily: mono, fontSize: 15, color: C.muted, marginTop: 4, lineHeight: 1.45 }}>
                {c.d}
              </div>
              <div style={{ height: 4, borderRadius: 2, background: `${C.line}66`, marginTop: 10 }}>
                <div style={{ width: `${barra * 100}%`, height: 4, borderRadius: 2, background: color }} />
              </div>
            </div>
          </Aparece>
        );
      })}
    </div>
  );
};

export const Ataques: React.FC<{ display: string }> = ({ display }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        padding: "20px 72px 190px",
        justifyContent: "center",
        transform: `translateY(${Math.sin(frame / 44) * 3}px)`,
      }}
    >
      <div style={{ maxWidth: 980 }}>
        <Encabezado
          paso="AMENAZAS"
          sub="DE QUÉ NOS DEFENDEMOS"
          titulo="Ataques posibles contra una planilla"
          display={display}
        />
      </div>
      <Lista datos={ATAQUES} color={C.error} marca="✕" display={display} />
    </AbsoluteFill>
  );
};

export const Defensas: React.FC<{ display: string }> = ({ display }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        padding: "20px 72px 190px",
        justifyContent: "center",
        transform: `translateY(${Math.sin(frame / 44) * 3}px)`,
      }}
    >
      <div style={{ maxWidth: 980 }}>
        <Encabezado
          paso="DEFENSAS"
          sub="UNA RESPUESTA POR CADA ATAQUE"
          titulo="Cómo protegemos sus datos"
          display={display}
        />
      </div>
      <Lista datos={DEFENSAS} color={C.ok} marca="✓" display={display} />
    </AbsoluteFill>
  );
};
