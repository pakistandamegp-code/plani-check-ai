import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { C, mono } from "../theme";
import { Aparece, Encabezado } from "../components/Paso";

const Columna: React.FC<{
  indice: string;
  nombre: string;
  tono: string;
  hace: string[];
  rutas: string[];
  display: string;
}> = ({ indice, nombre, tono, hace, rutas, display }) => (
  <div
    style={{
      border: `1px solid ${tono}55`,
      borderTop: `4px solid ${tono}`,
      background: C.surface,
      borderRadius: 6,
      padding: "20px 22px",
    }}
  >
    <div style={{ fontFamily: mono, fontSize: 15, letterSpacing: 1.6, color: tono }}>{indice}</div>
    <div
      style={{
        fontFamily: display,
        fontWeight: 700,
        fontSize: 30,
        color: C.text,
        marginTop: 8,
        lineHeight: 1.15,
      }}
    >
      {nombre}
    </div>
    <ul style={{ margin: "14px 0 0 20px", padding: 0, fontFamily: mono, fontSize: 19, color: C.muted, lineHeight: 1.5 }}>
      {hace.map((h) => (
        <li key={h} style={{ marginBottom: 6 }}>
          {h}
        </li>
      ))}
    </ul>
    <div style={{ marginTop: 14, borderTop: `1px solid ${C.line}66`, paddingTop: 12 }}>
      {rutas.map((r) => (
        <div key={r} style={{ fontFamily: mono, fontSize: 17, color: tono, marginTop: 4 }}>
          {r}
        </div>
      ))}
    </div>
  </div>
);

export const Apis: React.FC<{ display: string; retrasos?: { dos: number; nota: number } }> = ({
  display,
  retrasos,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        padding: "24px 72px 190px",
        justifyContent: "center",
        transform: `translateY(${Math.sin(frame / 42) * 3}px)`,
      }}
    >
      <div style={{ maxWidth: 950 }}>
        <Encabezado paso="LAS DOS APIS" sub="ARQUITECTURA DEL PRODUCTO" titulo="Dos interfaces, una responsabilidad cada una" display={display} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 24 }}>
        <Aparece delay={12}>
          <Columna
            display={display}
            indice="API 1"
            tono={C.teal}
            nombre="Recepción y Gestión"
            hace={["Abre la sesión y fija el empleador", "Recibe y sanea el archivo CSV", "Guarda versiones y bitácora"]}
            rutas={["POST /recepcion/sesion", "POST /recepcion/solicitudes", "GET /recepcion/auditoria"]}
          />
        </Aparece>
        <Aparece delay={retrasos?.dos ?? 34}>
          <Columna
            display={display}
            indice="API 2"
            tono={C.gold}
            nombre="Validación y Resultados"
            hace={["Ejecuta las reglas de niveles A–F", "Devuelve hallazgos explicados", "Calcula el estado de la planilla"]}
            rutas={["POST /validacion/ejecuciones", "GET /validacion/…/hallazgos", "GET /validacion/reglas"]}
          />
        </Aparece>
      </div>

      <Sequence from={retrasos?.nota ?? 60} layout="none">
        <Aparece estilo={{ marginTop: 20 }}>
          <div style={{ fontFamily: mono, fontSize: 20, color: C.muted }}>
            La API 1 <span style={{ color: C.text }}>nunca juzga</span> los datos · la API 2{" "}
            <span style={{ color: C.text }}>nunca los modifica</span>
          </div>
        </Aparece>
      </Sequence>
    </AbsoluteFill>
  );
};
