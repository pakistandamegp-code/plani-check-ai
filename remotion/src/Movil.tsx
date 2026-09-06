import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadDisplay } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadMono } from "@remotion/google-fonts/IBMPlexMono";
import { Subtitulos } from "./components/Subtitulos";
import { AUDIO, ESCENAS, TOTAL, escena } from "./guion-movil";
import { C, mono } from "./theme";
import { MarcaAgua } from "./components/Marca";

const { fontFamily: display } = loadDisplay("normal", { weights: ["700"], subsets: ["latin"] });
loadMono("normal", { weights: ["400", "600"], subsets: ["latin"] });

export const DURACION_MOVIL = TOTAL;

/* ---------- paleta de la app (tema claro dentro del teléfono) ---------- */

const A = {
  fondo: "#f4f7fb",
  tarjeta: "#ffffff",
  borde: "#dbe3ee",
  texto: "#161d2c",
  suave: "#68758c",
  teal: "#0f8ba3",
  tealSuave: "#e5f6fa",
  gold: "#b07a1c",
  goldSuave: "#fdf4e3",
  error: "#c8412f",
  errorSuave: "#fdeeeb",
  ok: "#1f8f68",
  okSuave: "#e8f7f0",
};

const Aparece: React.FC<{ delay?: number; desde?: number; children: React.ReactNode; estilo?: React.CSSProperties }> = ({
  delay = 0,
  desde = 22,
  children,
  estilo,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 22, stiffness: 130 } });
  return (
    <div style={{ opacity: s, transform: `translateY(${interpolate(s, [0, 1], [desde, 0])}px)`, ...estilo }}>
      {children}
    </div>
  );
};

/* ---------- marco del iPhone ---------- */

const IconoBateria: React.FC = () => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
    <span
      style={{
        width: 34,
        height: 17,
        border: `2px solid ${A.texto}`,
        borderRadius: 4,
        padding: 2,
        display: "inline-flex",
      }}
    >
      <span style={{ flex: 1, background: A.texto, borderRadius: 1 }} />
    </span>
    <span style={{ width: 3, height: 7, background: A.texto, borderRadius: 1 }} />
  </span>
);

const BarraEstado: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 92,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 52px",
      fontFamily: mono,
      fontSize: 24,
      fontWeight: 600,
      color: A.texto,
      zIndex: 3,
    }}
  >
    <span>9:41</span>
    <span style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
      <span style={{ display: "inline-flex", alignItems: "flex-end", gap: 3 }}>
        {[8, 12, 16, 20].map((h) => (
          <span key={h} style={{ width: 5, height: h, background: A.texto, borderRadius: 1 }} />
        ))}
      </span>
      <span style={{ fontSize: 22 }}>WiFi</span>
      <IconoBateria />
    </span>
  </div>
);

const IPhone: React.FC<{ titulo: string; sub?: string; children: React.ReactNode }> = ({ titulo, sub, children }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        width: 840,
        height: 1380,
        borderRadius: 96,
        background: "linear-gradient(160deg, #3a455f 0%, #1c2333 100%)",
        padding: 12,
        boxShadow: "0 50px 110px rgba(0,0,0,0.6)",
        transform: `translateY(${Math.sin(frame / 50) * 5}px)`,
      }}
    >
      <div
        style={{
          height: "100%",
          borderRadius: 84,
          background: "#05070c",
          padding: 10,
        }}
      >
        <div
          style={{
            position: "relative",
            height: "100%",
            borderRadius: 76,
            overflow: "hidden",
            background: A.fondo,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <BarraEstado />
          {/* Dynamic Island */}
          <div
            style={{
              position: "absolute",
              top: 26,
              left: "50%",
              transform: "translateX(-50%)",
              width: 232,
              height: 62,
              borderRadius: 34,
              background: "#05070c",
              zIndex: 4,
            }}
          />
          {/* Barra de navegación de la app */}
          <div
            style={{
              marginTop: 92,
              padding: "22px 40px 20px",
              background: "#ffffff",
              borderBottom: `1px solid ${A.borde}`,
            }}
          >
            <div style={{ fontFamily: mono, fontSize: 19, letterSpacing: 2.4, color: A.teal }}>
              {sub ?? "PREVALIDA PLANILLAS"}
            </div>
            <div style={{ fontFamily: display, fontWeight: 700, fontSize: 40, color: A.texto, marginTop: 6 }}>
              {titulo}
            </div>
          </div>
          <div style={{ flex: 1, padding: "26px 34px 0", minHeight: 0, overflow: "hidden" }}>{children}</div>
          {/* Indicador de inicio */}
          <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 260, height: 8, borderRadius: 4, background: "#c3cbd8" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Escenario: React.FC<{ etiqueta: string; children: React.ReactNode }> = ({ etiqueta, children }) => (
  <AbsoluteFill style={{ alignItems: "center", paddingTop: 112 }}>
    <Aparece desde={30}>
      <div
        style={{
          fontFamily: mono,
          fontSize: 26,
          letterSpacing: 3,
          color: C.teal,
          border: `1px solid ${C.teal}66`,
          background: `${C.teal}14`,
          borderRadius: 6,
          padding: "8px 20px",
          marginBottom: 24,
        }}
      >
        {etiqueta}
      </div>
    </Aparece>
    <Aparece delay={4} desde={60}>
      {children}
    </Aparece>
  </AbsoluteFill>
);

/* ---------- piezas de interfaz dentro del teléfono ---------- */

const Tarjeta: React.FC<{ tono?: string; fondo?: string; children: React.ReactNode; estilo?: React.CSSProperties }> = ({
  tono = A.borde,
  fondo = A.tarjeta,
  children,
  estilo,
}) => (
  <div
    style={{
      border: `1px solid ${A.borde}`,
      borderLeft: `8px solid ${tono}`,
      borderRadius: 10,
      background: fondo,
      padding: "20px 22px",
      boxShadow: "0 2px 12px rgba(22,29,44,0.06)",
      ...estilo,
    }}
  >
    {children}
  </div>
);

const Etiqueta: React.FC<{ texto: string; color: string }> = ({ texto, color }) => (
  <span
    style={{
      fontFamily: mono,
      fontSize: 17,
      letterSpacing: 1.4,
      color,
      border: `1px solid ${color}66`,
      borderRadius: 4,
      padding: "4px 10px",
    }}
  >
    {texto}
  </span>
);

const Dato: React.FC<{ k: string; v: string; color?: string }> = ({ k, v, color = A.texto }) => (
  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: mono, fontSize: 21, marginTop: 12 }}>
    <span style={{ color: A.suave }}>{k}</span>
    <span style={{ color }}>{v}</span>
  </div>
);

const Boton: React.FC<{ texto: string; tono?: string; pulsa?: boolean }> = ({ texto, tono = A.teal, pulsa = false }) => {
  const frame = useCurrentFrame();
  const p = pulsa ? 1 + Math.sin(frame / 9) * 0.012 : 1;
  return (
    <div
      style={{
        marginTop: 24,
        background: tono,
        color: "#ffffff",
        borderRadius: 10,
        padding: "22px 0",
        textAlign: "center",
        fontFamily: display,
        fontSize: 30,
        fontWeight: 700,
        transform: `scale(${p})`,
      }}
    >
      {texto}
    </div>
  );
};

/* ---------- escenas ---------- */

const Portada: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 6, fps, config: { damping: 20, stiffness: 110 } });
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 92 }}>
      <div
        style={{
          textAlign: "center",
          opacity: s,
          transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)`,
          marginBottom: 26,
        }}
      >
        <h1
          style={{
            fontFamily: display,
            fontSize: 72,
            fontWeight: 700,
            color: C.text,
            letterSpacing: -2,
            lineHeight: 1,
            margin: 0,
          }}
        >
          Prevalida Planillas
        </h1>
        <p style={{ fontFamily: mono, fontSize: 32, color: C.teal, letterSpacing: 3, marginTop: 14 }}>
          DESDE EL CELULAR · PASO A PASO
        </p>
      </div>
      <div
        style={{
          opacity: s,
          transform: `scale(${interpolate(s, [0, 1], [0.9, 1])})`,
        }}
      >
        <IPhone titulo="Inicio" sub="DEMOSTRACIÓN">
          <Aparece delay={14}>
            <Tarjeta tono={A.teal}>
              <Etiqueta texto="SESIÓN DEMO" color={A.teal} />
              <div style={{ fontFamily: display, fontSize: 36, fontWeight: 700, color: A.texto, marginTop: 14 }}>
                Prevalidar una planilla
              </div>
              <div style={{ fontFamily: mono, fontSize: 22, color: A.suave, marginTop: 10, lineHeight: 1.45 }}>
                Cinco pasos: abrir sesión, subir, validar, corregir y reenviar.
              </div>
              <Boton texto="Comenzar" pulsa />
            </Tarjeta>
          </Aparece>
          <Aparece delay={34} estilo={{ marginTop: 22 }}>
            <Tarjeta tono={A.gold} fondo={A.goldSuave}>
              <div style={{ fontFamily: mono, fontSize: 21, color: "#7a5a17", lineHeight: 1.45 }}>
                Datos ficticios. Nada de esto se presenta ante una entidad real.
              </div>
            </Tarjeta>
          </Aparece>
        </IPhone>
      </div>
    </AbsoluteFill>
  );
};

const Sesion: React.FC = () => (
  <Escenario etiqueta="PASO 1 · ABRIR SESIÓN">
    <IPhone titulo="Sesión de trabajo" sub="API 1 · RECEPCIÓN">
      <Aparece delay={10}>
        <Tarjeta tono={A.ok} fondo={A.okSuave}>
          <Etiqueta texto="SESIÓN ACTIVA" color={A.ok} />
          <Dato k="rol" v="Elaborador" />
          <Dato k="sesión" v="ses-9f2c…" />
        </Tarjeta>
      </Aparece>
      <Aparece delay={30} estilo={{ marginTop: 22 }}>
        <Tarjeta tono={A.teal}>
          <div style={{ fontFamily: mono, fontSize: 19, letterSpacing: 1.6, color: A.teal }}>EMPLEADOR</div>
          <div style={{ fontFamily: display, fontSize: 38, fontWeight: 700, color: A.texto, marginTop: 8 }}>
            EMP-DEMO-001
          </div>
          <div style={{ fontFamily: mono, fontSize: 21, color: A.suave, marginTop: 12, lineHeight: 1.45 }}>
            Lo fija el servidor según su sesión. El campo aparece bloqueado en la pantalla.
          </div>
        </Tarjeta>
      </Aparece>
      <Aparece delay={52} estilo={{ marginTop: 22 }}>
        <Tarjeta tono={A.borde}>
          <Dato k="permisos" v="cargar · validar" />
          <Dato k="bitácora" v="sesión registrada" color={A.ok} />
        </Tarjeta>
      </Aparece>
    </IPhone>
  </Escenario>
);

const Cargar: React.FC = () => {
  const frame = useCurrentFrame();
  const subida = interpolate(frame, [56, 96], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Escenario etiqueta="PASO 2 · SUBIR LA PLANILLA">
      <IPhone titulo="Nueva planilla" sub="API 1 · RECEPCIÓN">
        <Aparece delay={10}>
          <Tarjeta>
            <div style={{ fontFamily: mono, fontSize: 19, color: A.suave, letterSpacing: 1.4 }}>PERIODO</div>
            <div style={{ fontFamily: display, fontSize: 38, fontWeight: 700, color: A.texto, marginTop: 6 }}>
              Febrero 2026
            </div>
            <Dato k="empleador" v="EMP-DEMO-001" />
            <Dato k="archivo" v="planilla.csv" />
            <Dato k="trabajadores" v="13" />
          </Tarjeta>
        </Aparece>
        <Aparece delay={30} estilo={{ marginTop: 22 }}>
          <div
            style={{
              border: `3px dashed ${A.teal}`,
              borderRadius: 12,
              background: A.tealSuave,
              padding: "38px 20px",
              textAlign: "center",
              fontFamily: mono,
              fontSize: 24,
              color: "#1c5c6a",
              lineHeight: 1.5,
            }}
          >
            Toque para elegir el archivo
            <br />
            CSV UTF-8 · máximo 5 MB
          </div>
          <Boton texto="Enviar planilla" pulsa />
        </Aparece>
        <Aparece delay={56} estilo={{ marginTop: 22 }}>
          <div style={{ fontFamily: mono, fontSize: 20, color: A.suave }}>
            subiendo… {Math.round(subida * 100)}%
          </div>
          <div style={{ height: 10, borderRadius: 5, background: "#e2e8f1", marginTop: 8 }}>
            <div style={{ width: `${subida * 100}%`, height: 10, borderRadius: 5, background: A.teal }} />
          </div>
        </Aparece>
      </IPhone>
    </Escenario>
  );
};

/* Refleja la animación real de ProcesoValidacion: recepción, limpieza,
   niveles A–F, bitácora y resultado. */
const PASOS = [
  { c: "Recepción segura", d: "Tipo, tamaño y límites antes de leer.", nivel: null as string | null },
  { c: "Limpieza de celdas", d: "Se neutralizan fórmulas y HTML.", nivel: null },
  { c: "Estructura del archivo", d: "Columnas, encabezados y formato.", nivel: "A" },
  { c: "Identidad del trabajador", d: "Documento, tipo y nombre.", nivel: "B" },
  { c: "Datos laborales", d: "Cargo, jornada y fechas.", nivel: "C" },
  { c: "Salarios y viáticos", d: "Montos, topes y proporciones.", nivel: "D" },
  { c: "Consistencia interna", d: "Sumas y cruces entre columnas.", nivel: "E" },
  { c: "Historial del empleador", d: "Comparación con versiones previas.", nivel: "F" },
  { c: "Registro en bitácora", d: "Actor, fecha y versión de reglas.", nivel: null },
  { c: "Resultado listo", d: "Estado del ciclo de vida calculado.", nivel: null },
];

const Validando: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const inicio = 26;
  const tramo = Math.max(14, (dur - inicio - 40) / PASOS.length);
  const idx = Math.min(PASOS.length - 1, Math.max(0, Math.floor((frame - inicio) / tramo)));
  const actual = PASOS[idx];
  const terminado = frame >= inicio + tramo * PASOS.length;
  const pct = Math.round(
    interpolate(frame, [inicio, inicio + tramo * PASOS.length], [0, 100], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const pulso = 1 + Math.sin(frame / 6) * 0.03;

  return (
    <Escenario etiqueta="PASO 3 · VALIDACIÓN EN VIVO">
      <IPhone titulo={terminado ? "Análisis completo" : `Paso ${idx + 1} de ${PASOS.length}`} sub="API 2 · VALIDACIÓN">
        {/* Progreso */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ flex: 1, height: 12, borderRadius: 6, background: "#e2e8f1", overflow: "hidden" }}>
            <div
              style={{
                width: `${pct}%`,
                height: 12,
                borderRadius: 6,
                background: terminado ? A.ok : A.teal,
              }}
            />
          </div>
          <span style={{ fontFamily: mono, fontSize: 22, color: A.suave }}>{pct}%</span>
        </div>

        {/* Insignia del nivel activo */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 26 }}>
          <div
            style={{
              position: "relative",
              width: 176,
              height: 176,
              borderRadius: 88,
              border: `8px solid ${terminado ? A.ok : A.teal}`,
              background: terminado ? A.okSuave : A.tealSuave,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${terminado ? 1 : pulso})`,
            }}
          >
            <span
              style={{
                fontFamily: display,
                fontWeight: 700,
                fontSize: actual.nivel ? 88 : 44,
                color: terminado ? A.ok : A.teal,
              }}
            >
              {terminado ? "✓" : (actual.nivel ?? "···")}
            </span>
            {!terminado && (
              <div
                style={{
                  position: "absolute",
                  inset: -14,
                  borderRadius: 96,
                  border: `4px solid ${A.teal}`,
                  opacity: interpolate((frame % 30) / 30, [0, 1], [0.5, 0]),
                  transform: `scale(${interpolate((frame % 30) / 30, [0, 1], [0.95, 1.12])})`,
                }}
              />
            )}
          </div>
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 34, color: A.texto, marginTop: 18 }}>
            {terminado ? "Validación finalizada" : actual.nivel ? `Nivel ${actual.nivel} · ${actual.c}` : actual.c}
          </div>
          <div style={{ fontFamily: mono, fontSize: 21, color: A.suave, marginTop: 8, textAlign: "center" }}>
            {terminado ? "Seis niveles revisados y evento guardado." : actual.d}
          </div>
        </div>

        {/* Lista de pasos */}
        <div style={{ marginTop: 26 }}>
          {PASOS.map((p, i) => {
            const hecho = terminado || i < idx;
            const activo = !terminado && i === idx;
            return (
              <div
                key={p.c}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  border: `1px solid ${activo ? A.teal : A.borde}`,
                  background: activo ? A.tealSuave : "#ffffff",
                  borderRadius: 8,
                  padding: "10px 16px",
                  marginBottom: 8,
                  opacity: hecho || activo ? 1 : 0.45,
                }}
              >
                <span
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 17,
                    background: hecho ? A.ok : activo ? A.teal : "#e2e8f1",
                    color: "#ffffff",
                    fontFamily: mono,
                    fontSize: 18,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {hecho ? "✓" : (p.nivel ?? "·")}
                </span>
                <span style={{ fontFamily: mono, fontSize: 21, color: A.texto }}>
                  {p.nivel ? `Nivel ${p.nivel} · ${p.c}` : p.c}
                </span>
              </div>
            );
          })}
        </div>
      </IPhone>
    </Escenario>
  );
};

const Contador: React.FC<{ hasta: number; delay: number }> = ({ hasta, delay }) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [delay, delay + 24], [0, hasta], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <>{Math.round(v)}</>;
};

const Resultado: React.FC = () => (
  <Escenario etiqueta="PASO 4 · RESULTADO">
    <IPhone titulo="Hallazgos de la v1" sub="API 2 · RESULTADOS">
      <Aparece delay={10}>
        <Tarjeta tono={A.error} fondo={A.errorSuave}>
          <Etiqueta texto="ERRORES BLOQUEANTES" color={A.error} />
          <div style={{ fontFamily: display, fontSize: 84, fontWeight: 700, color: A.error, lineHeight: 1.1 }}>
            <Contador hasta={6} delay={16} />
          </div>
          <div style={{ fontFamily: mono, fontSize: 21, color: "#7d3a30" }}>Hay que corregirlos para avanzar.</div>
        </Tarjeta>
      </Aparece>
      <Aparece delay={32} estilo={{ marginTop: 20 }}>
        <Tarjeta tono={A.gold} fondo={A.goldSuave}>
          <Etiqueta texto="ALERTAS POR REVISAR" color={A.gold} />
          <div style={{ fontFamily: display, fontSize: 84, fontWeight: 700, color: A.gold, lineHeight: 1.1 }}>
            <Contador hasta={5} delay={38} />
          </div>
          <div style={{ fontFamily: mono, fontSize: 21, color: "#7a5a17" }}>Se confirman con una justificación.</div>
        </Tarjeta>
      </Aparece>
      <Aparece delay={56} estilo={{ marginTop: 20 }}>
        <Tarjeta>
          <Dato k="registros válidos" v="2" color={A.ok} />
          <Dato k="estado" v="CON_ERRORES" color={A.error} />
        </Tarjeta>
      </Aparece>
    </IPhone>
  </Escenario>
);

const Corregir: React.FC = () => (
  <Escenario etiqueta="PASO 4 · DETALLE DEL HALLAZGO">
    <IPhone titulo="Fila 4 · documento" sub="REG-IDE-002 · NIVEL B">
      <Aparece delay={8}>
        <Tarjeta tono={A.error} fondo={A.errorSuave}>
          <Etiqueta texto="ERROR BLOQUEANTE" color={A.error} />
          <div style={{ fontFamily: mono, fontSize: 24, color: A.texto, marginTop: 12, lineHeight: 1.45 }}>
            El número de documento no cumple el formato de pasaporte.
          </div>
          <Dato k="valor recibido" v='"8-742-118"' color={A.error} />
          <Dato k="tipo declarado" v="PASAPORTE" color={A.error} />
        </Tarjeta>
      </Aparece>
      <Aparece delay={30} estilo={{ marginTop: 20 }}>
        <Tarjeta tono={A.teal}>
          <div style={{ fontFamily: mono, fontSize: 19, letterSpacing: 1.6, color: A.teal }}>ASÍ QUEDA CORREGIDO</div>
          <div style={{ fontFamily: mono, fontSize: 20, color: A.suave, marginTop: 14 }}>
            fila 4 · numero_documento
          </div>
          <div
            style={{
              fontFamily: mono,
              fontSize: 25,
              color: A.error,
              textDecoration: "line-through",
              marginTop: 8,
            }}
          >
            "8-742-118" con tipo PASAPORTE
          </div>
          <div style={{ fontFamily: mono, fontSize: 25, color: A.ok, marginTop: 10 }}>✓ cambie el tipo a CEDULA</div>
          <div style={{ fontFamily: mono, fontSize: 25, color: A.ok, marginTop: 6 }}>
            ✓ o escriba el pasaporte real, sin guiones
          </div>
          <Boton texto="Guardar fila" tono={A.ok} pulsa />
        </Tarjeta>
      </Aparece>
      <Aparece delay={58} estilo={{ marginTop: 20 }}>
        <Tarjeta tono={A.gold} fondo={A.goldSuave}>
          <Etiqueta texto="ALERTA · FILA 2" color={A.gold} />
          <div style={{ fontFamily: mono, fontSize: 21, color: "#7a5a17", marginTop: 10, lineHeight: 1.45 }}>
            Viáticos sobre el 25 % del sueldo: escriba el motivo y confírmela.
          </div>
        </Tarjeta>
      </Aparece>
    </IPhone>
  </Escenario>
);

const Reenviar: React.FC = () => (
  <Escenario etiqueta="PASO 5 · NUEVA VERSIÓN">
    <IPhone titulo="Enviar la corrección" sub="API 1 · VERSIONES">
      <Aparece delay={10}>
        <Tarjeta tono={A.ok} fondo={A.okSuave}>
          <Etiqueta texto="VERSIÓN 2" color={A.ok} />
          <div style={{ fontFamily: mono, fontSize: 22, color: "#1c5b46", marginTop: 12, lineHeight: 1.45 }}>
            2 registros corregidos · 1 alerta justificada
          </div>
          <Dato k="motivo" v="corrección de documento" />
        </Tarjeta>
      </Aparece>
      <Aparece delay={32} estilo={{ marginTop: 20 }}>
        <Tarjeta>
          <div style={{ fontFamily: mono, fontSize: 19, letterSpacing: 1.6, color: A.suave }}>HISTORIAL</div>
          <Dato k="versión 1" v="CON_ERRORES" color={A.error} />
          <Dato k="versión 2" v="RECIBIDA" color={A.teal} />
          <div style={{ fontFamily: mono, fontSize: 20, color: A.suave, marginTop: 14, lineHeight: 1.45 }}>
            La versión anterior se conserva completa: nada se sobrescribe.
          </div>
          <Boton texto="Revalidar" tono={A.ok} pulsa />
        </Tarjeta>
      </Aparece>
    </IPhone>
  </Escenario>
);

const Listo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sello = spring({ frame: frame - 34, fps, config: { damping: 11, stiffness: 140 } });
  return (
    <Escenario etiqueta="RESULTADO FINAL">
      <IPhone titulo="Planilla prevalidada" sub="API 2 · VALIDACIÓN">
        <Aparece delay={10}>
          <Tarjeta tono={A.ok} fondo={A.okSuave}>
            <Dato k="errores" v="0" color={A.ok} />
            <Dato k="alertas" v="0 pendientes" color={A.ok} />
            <Dato k="registros válidos" v="13" color={A.ok} />
          </Tarjeta>
        </Aparece>
        <div
          style={{
            marginTop: 30,
            display: "flex",
            justifyContent: "center",
            transform: `scale(${interpolate(sello, [0, 1], [0.7, 1])}) rotate(${interpolate(sello, [0, 1], [-8, -3])}deg)`,
            opacity: sello,
          }}
        >
          <div
            style={{
              border: `5px solid ${A.ok}`,
              background: A.okSuave,
              borderRadius: 10,
              padding: "18px 34px",
              fontFamily: mono,
              fontSize: 46,
              letterSpacing: 3,
              color: A.ok,
            }}
          >
            PREVALIDADA
          </div>
        </div>
        <Aparece delay={54} estilo={{ marginTop: 30 }}>
          <div style={{ fontFamily: mono, fontSize: 22, color: A.suave, lineHeight: 1.5, textAlign: "center" }}>
            Sin filas rechazadas y con el historial de cada versión guardado.
          </div>
        </Aparece>
      </IPhone>
    </Escenario>
  );
};

/* ---------- cierre de seguridad ---------- */

const FilaSeguridad: React.FC<{ i: number; icono: string; color: string; t: string; d: string }> = ({
  i,
  icono,
  color,
  t,
  d,
}) => (
  <Aparece delay={10 + i * 14} desde={20} estilo={{ marginBottom: 14 }}>
    <div
      style={{
        display: "flex",
        gap: 18,
        alignItems: "flex-start",
        background: C.surface,
        border: `1px solid ${C.line}66`,
        borderLeft: `6px solid ${color}`,
        borderRadius: 8,
        padding: "18px 22px",
      }}
    >
      <span style={{ fontFamily: mono, fontSize: 30, color }}>{icono}</span>
      <div>
        <div style={{ fontFamily: display, fontWeight: 700, fontSize: 32, color: C.text }}>{t}</div>
        <div style={{ fontFamily: mono, fontSize: 24, color: C.muted, marginTop: 6, lineHeight: 1.4 }}>{d}</div>
      </div>
    </div>
  </Aparece>
);

const ATAQUES = [
  { t: "Ver la planilla de otra empresa", d: "Cambiar el empleador en la petición." },
  { t: "CSV con fórmulas escondidas", d: "Celdas que se ejecutan al abrir el archivo." },
  { t: "Repetir el mismo envío", d: "Duplicar la planilla con reintentos." },
  { t: "Adivinar identificadores", d: "Probar IDs para llegar a datos ajenos." },
  { t: "Alterar una versión presentada", d: "Reescribir el historial de la planilla." },
];

const DEFENSAS = [
  { t: "El empleador lo fija el servidor", d: "Sale de la sesión; el teléfono no lo elige." },
  { t: "Cada celda se limpia al recibirla", d: "Solo CSV UTF-8 y con límite de tamaño." },
  { t: "Llave de idempotencia", d: "Un envío repetido no crea otra planilla." },
  { t: "Identificadores de 128 bits", d: "Aleatorios: no se pueden adivinar." },
  { t: "Versionado inmutable y bitácora", d: "Nada se sobrescribe; todo queda registrado." },
];

const Panel: React.FC<{ etiqueta: string; titulo: string; datos: typeof ATAQUES; color: string; icono: string }> = ({
  etiqueta,
  titulo,
  datos,
  color,
  icono,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        padding: "0 90px 300px",
        transform: `translateY(${Math.sin(frame / 46) * 4}px)`,
      }}
    >
      <Aparece>
        <div style={{ fontFamily: mono, fontSize: 28, letterSpacing: 4, color }}>{etiqueta}</div>
        <h2
          style={{
            fontFamily: display,
            fontWeight: 700,
            fontSize: 76,
            color: C.text,
            letterSpacing: -2,
            lineHeight: 1.05,
            margin: "14px 0 34px",
          }}
        >
          {titulo}
        </h2>
      </Aparece>
      {datos.map((x, i) => (
        <FilaSeguridad key={x.t} i={i} icono={icono} color={color} t={x.t} d={x.d} />
      ))}
    </AbsoluteFill>
  );
};

const AtaquesMovil: React.FC = () => (
  <Panel etiqueta="AMENAZAS" titulo="Ataques posibles" datos={ATAQUES} color={C.error} icono="✕" />
);

const DefensasMovil: React.FC = () => (
  <Panel etiqueta="DEFENSAS" titulo="Cómo lo protegemos" datos={DEFENSAS} color={C.ok} icono="✓" />
);

/* ---------- fondo y montaje ---------- */

const FondoMovil: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `linear-gradient(170deg, ${C.ink} 0%, #0d1320 60%, ${C.ink2} 100%)` }}>
      <AbsoluteFill
        style={{
          opacity: 0.5,
          background: `radial-gradient(closest-side at 70% ${28 + Math.sin(frame / 90) * 6}%, ${C.teal}22, transparent)`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.18,
          backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
          backgroundSize: "120px 120px",
        }}
      />
    </AbsoluteFill>
  );
};

const Escena: React.FC<{ id: string; children: React.ReactNode | ((dur: number) => React.ReactNode) }> = ({
  id,
  children,
}) => {
  const e = escena(id);
  return (
    <Sequence from={e.inicio} durationInFrames={e.dur}>
      {typeof children === "function" ? children(e.dur) : children}
    </Sequence>
  );
};

export const MovilVideo: React.FC = () => (
  <AbsoluteFill>
    <FondoMovil />
    <Audio src={staticFile(AUDIO)} />

    <Escena id="intro">
      <Portada />
    </Escena>
    <Escena id="sesion">
      <Sesion />
    </Escena>
    <Escena id="cargar">
      <Cargar />
    </Escena>
    <Escena id="validando">{(dur) => <Validando dur={dur} />}</Escena>
    <Escena id="resultado">
      <Resultado />
    </Escena>
    <Escena id="corregir">
      <Corregir />
    </Escena>
    <Escena id="reenviar">
      <Reenviar />
    </Escena>
    <Escena id="listo">
      <Listo />
    </Escena>
    <Escena id="ataques">
      <AtaquesMovil />
    </Escena>
    <Escena id="defensas">
      <DefensasMovil />
    </Escena>

    <MarcaAgua display={display} escala={1.7} />
    <Subtitulos lineas={ESCENAS.flatMap((e) => e.lineas)} ancho={880} tamano={34} abajo={110} />
  </AbsoluteFill>
);
