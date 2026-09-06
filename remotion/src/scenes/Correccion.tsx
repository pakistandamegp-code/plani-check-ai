import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from "remotion";
import { C, mono } from "../theme";
import { Aparece, Encabezado } from "../components/Paso";

const COLS = ["fila", "tipo_documento", "numero_documento", "sueldo", "viaticos"];
const FILAS = [
  { f: "2", tipo: "CEDULA", num: "8-742-118", sueldo: "1,650.00", via: "420.00", malo: "via" },
  { f: "3", tipo: "CEDULA", num: "8-901-233", sueldo: "1,200.00", via: "90.00", malo: null },
  { f: "4", tipo: "PASAPORTE", num: "8-742-118", sueldo: "1,400.00", via: "80.00", malo: "num" },
];

const Celda: React.FC<{ v: string; estado?: "error" | "alerta" | null; parpadeo?: number }> = ({
  v,
  estado = null,
  parpadeo = 0,
}) => {
  const color = estado === "error" ? C.error : estado === "alerta" ? C.gold : C.text;
  return (
    <div
      style={{
        padding: "7px 14px",
        fontFamily: mono,
        fontSize: 18,
        color: estado ? color : C.muted,
        background: estado ? `${color}${parpadeo > 0.5 ? "33" : "18"}` : "transparent",
        border: estado ? `1px solid ${color}` : `1px solid transparent`,
        borderRadius: 3,
      }}
    >
      {v}
    </div>
  );
};

export const Correccion: React.FC<{ display: string; retrasos?: { arreglo: number; alerta: number } }> = ({
  display,
  retrasos,
}) => {
  const frame = useCurrentFrame();
  const parpadeo = (Math.sin(frame / 7) + 1) / 2;
  const arreglo = retrasos?.arreglo ?? 60;
  const cambia = interpolate(frame, [arreglo, arreglo + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ padding: "16px 72px 196px", justifyContent: "center" }}>
      <div style={{ maxWidth: 950 }}>
      <Encabezado
        paso="QUÉ ESTÁ MAL"
        sub="Y CÓMO SE CORRIGE"
        titulo="El dato exacto y su arreglo"
        display={display}
      />
      </div>

      <Aparece delay={10} estilo={{ marginTop: 12 }}>
        <div
          style={{
            background: C.surface,
            border: `1px solid ${C.line}66`,
            borderRadius: 5,
            padding: "12px 14px",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "70px 1.1fr 1.3fr 1fr 1fr", gap: 8 }}>
            {COLS.map((c) => (
              <div key={c} style={{ fontFamily: mono, fontSize: 15, letterSpacing: 1.1, color: C.teal, padding: "0 14px 6px" }}>
                {c}
              </div>
            ))}
            {FILAS.map((r) => (
              <React.Fragment key={r.f}>
                <Celda v={r.f} />
                <Celda v={r.tipo} />
                <Celda
                  v={r.malo === "num" && cambia > 0.5 ? "PA1234567" : r.num}
                  estado={r.malo === "num" ? "error" : null}
                  parpadeo={r.malo === "num" ? parpadeo : 0}
                />
                <Celda v={r.sueldo} />
                <Celda v={r.via} estado={r.malo === "via" ? "alerta" : null} parpadeo={r.malo === "via" ? parpadeo : 0} />
              </React.Fragment>
            ))}
          </div>
        </div>
      </Aparece>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 16, marginTop: 12 }}>
        <Aparece delay={arreglo - 18}>
          <div
            style={{
              border: `1px solid ${C.error}66`,
              borderLeft: `5px solid ${C.error}`,
              background: C.surface,
              borderRadius: 4,
              padding: "12px 16px",
            }}
          >
            <div style={{ fontFamily: mono, fontSize: 14, letterSpacing: 1.4, color: C.error }}>
              ERROR BLOQUEANTE · REG-IDE-002 · FILA 4
            </div>
            <div style={{ fontFamily: mono, fontSize: 17, color: C.text, marginTop: 8, lineHeight: 1.45 }}>
              tipo_documento dice <span style={{ color: C.gold }}>PASAPORTE</span>, pero el número tiene formato de
              cédula.
            </div>
            <div style={{ fontFamily: mono, fontSize: 16, color: C.muted, marginTop: 8, lineHeight: 1.55 }}>
              Arréglelo de una de estas dos formas:
              <br />
              1 · cambie el tipo a <span style={{ color: C.ok }}>CEDULA</span>
              <br />
              2 · o escriba el pasaporte real:{" "}
              <span style={{ color: C.ok }}>letras y números, sin guiones</span>
            </div>
          </div>
        </Aparece>

        <Sequence from={retrasos?.alerta ?? 100} layout="none">
          <Aparece>
            <div
              style={{
                border: `1px solid ${C.gold}66`,
                borderLeft: `5px solid ${C.gold}`,
                background: C.surface,
                borderRadius: 4,
                padding: "12px 16px",
              }}
            >
              <div style={{ fontFamily: mono, fontSize: 14, letterSpacing: 1.4, color: C.gold }}>
                ALERTA · REG-SAL-001 · FILA 2
              </div>
              <div style={{ fontFamily: mono, fontSize: 17, color: C.text, marginTop: 8, lineHeight: 1.45 }}>
                viáticos B/. 420.00 = 25.5 % del sueldo
              </div>
              <div style={{ fontFamily: mono, fontSize: 16, color: C.muted, marginTop: 8, lineHeight: 1.55 }}>
                No se corrige: se <span style={{ color: C.ok }}>justifica</span> por escrito y la planilla sigue
                avanzando.
              </div>
            </div>
          </Aparece>
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};
