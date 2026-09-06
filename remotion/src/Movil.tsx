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
import { Marca, MarcaAgua } from "./components/Marca";

const { fontFamily: display } = loadDisplay("normal", { weights: ["700"], subsets: ["latin"] });
loadMono("normal", { weights: ["400", "600"], subsets: ["latin"] });

export const DURACION_MOVIL = TOTAL;

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

/* ---------- marco del teléfono ---------- */

const Telefono: React.FC<{ titulo: string; children: React.ReactNode }> = ({ titulo, children }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        width: 700,
        height: 1420,
        borderRadius: 78,
        background: "#0a0e16",
        border: `10px solid #2b3550`,
        boxShadow: "0 40px 90px rgba(0,0,0,0.55)",
        padding: 16,
        transform: `translateY(${Math.sin(frame / 45) * 5}px)`,
      }}
    >
      <div
        style={{
          position: "relative",
          height: "100%",
          borderRadius: 64,
          overflow: "hidden",
          background: "#f7f9fc",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ height: 54, background: C.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 150, height: 26, borderRadius: 14, background: "#0a0e16" }} />
        </div>
        <div
          style={{
            background: C.ink,
            padding: "18px 26px 20px",
            color: C.text,
            fontFamily: display,
            fontSize: 34,
            fontWeight: 700,
          }}
        >
          {titulo}
          <div style={{ fontFamily: mono, fontSize: 17, color: C.teal, marginTop: 6, letterSpacing: 1.5 }}>
            PREVALIDA PLANILLAS · DEMO
          </div>
        </div>
        <div style={{ flex: 1, padding: "26px 26px 0", minHeight: 0 }}>{children}</div>
      </div>
    </div>
  );
};

const Tarjeta: React.FC<{ tono?: string; children: React.ReactNode; estilo?: React.CSSProperties }> = ({
  tono = "#d7dfec",
  children,
  estilo,
}) => (
  <div
    style={{
      border: `1px solid ${tono}`,
      borderLeft: `7px solid ${tono}`,
      borderRadius: 8,
      background: "#ffffff",
      padding: "20px 22px",
      boxShadow: "0 2px 10px rgba(22,29,44,0.06)",
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
      fontSize: 16,
      letterSpacing: 1.4,
      color,
      border: `1px solid ${color}`,
      borderRadius: 4,
      padding: "3px 9px",
    }}
  >
    {texto}
  </span>
);

const Boton: React.FC<{ texto: string; tono?: string }> = ({ texto, tono = C.teal }) => (
  <div
    style={{
      marginTop: 22,
      background: tono,
      color: C.ink,
      borderRadius: 8,
      padding: "20px 0",
      textAlign: "center",
      fontFamily: display,
      fontSize: 28,
      fontWeight: 700,
    }}
  >
    {texto}
  </div>
);

const Dato: React.FC<{ k: string; v: string; color?: string }> = ({ k, v, color = "#3d4a63" }) => (
  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: mono, fontSize: 20, marginTop: 10 }}>
    <span style={{ color: "#7b879d" }}>{k}</span>
    <span style={{ color }}>{v}</span>
  </div>
);

/* ---------- escenas ---------- */

const Portada: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const linea = spring({ frame: frame - 10, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: "center", padding: "0 110px 320px" }}>
      <Marca display={display} tamano={130} sub="DESDE EL CELULAR" />
      <Aparece delay={7}>
        <h1
          style={{
            fontFamily: display,
            fontSize: 118,
            fontWeight: 700,
            color: C.text,
            letterSpacing: -4,
            lineHeight: 0.98,
            margin: "26px 0 0",
          }}
        >
          Enviar,
          <br />
          corregir y
          <br />
          prevalidar
        </h1>
      </Aparece>
      <div
        style={{
          height: 6,
          marginTop: 34,
          width: interpolate(linea, [0, 1], [0, 520]),
          background: `linear-gradient(90deg, ${C.teal}, ${C.gold})`,
        }}
      />
      <Aparece delay={26}>
        <p style={{ fontFamily: mono, fontSize: 34, color: C.muted, marginTop: 30, lineHeight: 1.5 }}>
          El proceso completo de una planilla, paso a paso.
        </p>
      </Aparece>
    </AbsoluteFill>
  );
};

const Pantalla: React.FC<{ paso: string; children: React.ReactNode; titulo: string }> = ({ paso, titulo, children }) => (
  <AbsoluteFill style={{ alignItems: "center", paddingTop: 120 }}>
    <Aparece desde={40}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 26 }}>
        <Etiqueta texto={paso} color={C.gold} />
      </div>
    </Aparece>
    <Aparece delay={4} desde={60}>
      <Telefono titulo={titulo}>{children}</Telefono>
    </Aparece>
  </AbsoluteFill>
);

const ApisMovil: React.FC = () => (
  <AbsoluteFill style={{ justifyContent: "center", padding: "0 90px 300px" }}>
    <Marca display={display} tamano={104} sub="CÓMO FUNCIONA POR DENTRO" />
    <Aparece delay={12} estilo={{ marginTop: 46 }}>
      <Tarjeta tono={C.teal}>
        <Etiqueta texto="API 1 · RECEPCIÓN Y GESTIÓN" color="#2b7f92" />
        <div style={{ fontFamily: mono, fontSize: 26, color: "#3d4a63", marginTop: 14, lineHeight: 1.45 }}>
          Abre la sesión, recibe el archivo, guarda cada versión y anota todo en la bitácora.
        </div>
      </Tarjeta>
    </Aparece>
    <Aparece delay={30} estilo={{ marginTop: 22 }}>
      <Tarjeta tono={C.gold}>
        <Etiqueta texto="API 2 · VALIDACIÓN Y RESULTADOS" color="#b07a1c" />
        <div style={{ fontFamily: mono, fontSize: 26, color: "#3d4a63", marginTop: 14, lineHeight: 1.45 }}>
          Aplica las reglas de los niveles A a F y explica cada hallazgo.
        </div>
      </Tarjeta>
    </Aparece>
    <Aparece delay={52} estilo={{ marginTop: 22 }}>
      <Tarjeta tono={C.ok}>
        <Etiqueta texto="SEGURIDAD" color="#1f8f68" />
        <ul style={{ fontFamily: mono, fontSize: 24, color: "#3d4a63", lineHeight: 1.5, margin: "14px 0 0 26px" }}>
          <li>El empleador lo fija el servidor.</li>
          <li>Cada celda se limpia al recibirla.</li>
          <li>Toda acción queda registrada.</li>
        </ul>
      </Tarjeta>
    </Aparece>
  </AbsoluteFill>
);

const Cargar: React.FC = () => (
  <Pantalla paso="PASO 1 · CARGAR" titulo="Subir la planilla">
    <Aparece delay={12}>
      <Tarjeta>
        <div style={{ fontFamily: mono, fontSize: 18, color: "#7b879d", letterSpacing: 1.2 }}>PERIODO</div>
        <div style={{ fontFamily: display, fontSize: 34, fontWeight: 700, color: C.ink, marginTop: 6 }}>
          Febrero 2026
        </div>
        <Dato k="empleador" v="EMP-DEMO-001" />
        <Dato k="archivo" v="planilla.csv" />
        <Dato k="trabajadores" v="13" />
      </Tarjeta>
    </Aparece>
    <Aparece delay={34}>
      <div
        style={{
          marginTop: 22,
          border: `2px dashed ${C.teal}`,
          borderRadius: 10,
          background: "#ecf9fc",
          padding: "34px 20px",
          textAlign: "center",
          fontFamily: mono,
          fontSize: 22,
          color: "#3d4a63",
        }}
      >
        Arrastre el archivo
        <br />
        o tóquelo para elegirlo
      </div>
      <Boton texto="Enviar planilla" />
    </Aparece>
  </Pantalla>
);

const NIVELES = [
  "A · Estructura del archivo",
  "B · Identidad del trabajador",
  "C · Datos laborales",
  "D · Salarios y viáticos",
  "E · Consistencia interna",
  "F · Historial del empleador",
];

const Validando: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Pantalla paso="PASO 2 · VALIDAR" titulo="Revisando con las reglas">
      {NIVELES.map((n, i) => {
        const inicio = 10 + i * 22;
        const p = interpolate(frame, [inicio, inicio + 18], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div key={n} style={{ marginBottom: 16, opacity: interpolate(p, [0, 0.2], [0.25, 1]) }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: mono, fontSize: 20, color: "#3d4a63" }}>
              <span>{n}</span>
              <span style={{ color: p >= 1 ? C.ok : C.teal }}>{p >= 1 ? "listo" : "…"}</span>
            </div>
            <div style={{ height: 8, background: "#e3e9f2", borderRadius: 4, marginTop: 8 }}>
              <div style={{ height: 8, width: `${p * 100}%`, background: p >= 1 ? C.ok : C.teal, borderRadius: 4 }} />
            </div>
          </div>
        );
      })}
    </Pantalla>
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
  <Pantalla paso="PASO 3 · RESULTADO" titulo="Errores y alertas separados">
    <Aparece delay={10}>
      <Tarjeta tono={C.error}>
        <Etiqueta texto="ERRORES BLOQUEANTES" color={C.error} />
        <div style={{ fontFamily: display, fontSize: 76, fontWeight: 700, color: C.error, lineHeight: 1.1 }}>
          <Contador hasta={6} delay={16} />
        </div>
        <div style={{ fontFamily: mono, fontSize: 20, color: "#3d4a63" }}>Hay que corregirlos para avanzar.</div>
      </Tarjeta>
    </Aparece>
    <Aparece delay={30} estilo={{ marginTop: 20 }}>
      <Tarjeta tono={C.gold}>
        <Etiqueta texto="ALERTAS POR REVISAR" color="#b07a1c" />
        <div style={{ fontFamily: display, fontSize: 76, fontWeight: 700, color: "#b07a1c", lineHeight: 1.1 }}>
          <Contador hasta={5} delay={36} />
        </div>
        <div style={{ fontFamily: mono, fontSize: 20, color: "#3d4a63" }}>Se confirman con una justificación.</div>
      </Tarjeta>
    </Aparece>
    <Aparece delay={54} estilo={{ marginTop: 20 }}>
      <Tarjeta>
        <Dato k="registros válidos" v="2" color={C.ok} />
        <Dato k="estado" v="CON_ERRORES" color={C.error} />
      </Tarjeta>
    </Aparece>
  </Pantalla>
);

const Corregir: React.FC = () => (
  <Pantalla paso="PASO 4 · CORREGIR" titulo="Qué está mal y qué hacer">
    <Aparece delay={10}>
      <Tarjeta tono={C.error}>
        <Etiqueta texto="ERROR · REG-IDE-002 · FILA 4" color={C.error} />
        <div style={{ fontFamily: mono, fontSize: 24, color: C.ink, marginTop: 12, lineHeight: 1.4 }}>
          El número de documento no cumple el formato de pasaporte.
        </div>
        <Dato k="valor recibido" v='"8-742-118"' color={C.error} />
      </Tarjeta>
    </Aparece>
    <Aparece delay={30} estilo={{ marginTop: 20 }}>
      <Tarjeta tono={C.teal}>
        <div style={{ fontFamily: mono, fontSize: 17, letterSpacing: 1.4, color: "#2b7f92" }}>ASÍ QUEDA CORREGIDO</div>
        <div style={{ marginTop: 14 }}>
          <div style={{ fontFamily: mono, fontSize: 19, color: "#7b879d" }}>fila 4 · numero_documento</div>
          <div
            style={{
              fontFamily: mono,
              fontSize: 24,
              color: C.error,
              textDecoration: "line-through",
              marginTop: 8,
            }}
          >
            "8-742-118" con tipo PASAPORTE
          </div>
          <div style={{ fontFamily: mono, fontSize: 24, color: "#1f8f68", marginTop: 8 }}>
            ✓ cambie el tipo a CEDULA
          </div>
          <div style={{ fontFamily: mono, fontSize: 24, color: "#1f8f68", marginTop: 4 }}>
            ✓ o escriba el pasaporte real, sin guiones
          </div>
        </div>
      </Tarjeta>
    </Aparece>
    <Aparece delay={54} estilo={{ marginTop: 20 }}>
      <Tarjeta tono={C.gold}>
        <Etiqueta texto="ALERTA · FILA 2" color="#b07a1c" />
        <div style={{ fontFamily: mono, fontSize: 21, color: "#3d4a63", marginTop: 10, lineHeight: 1.45 }}>
          Viáticos sobre el 25 % del sueldo: escriba el motivo y confírmela.
        </div>
      </Tarjeta>
    </Aparece>
  </Pantalla>
);

const Reenviar: React.FC = () => (
  <Pantalla paso="PASO 5 · NUEVA VERSIÓN" titulo="Enviar la corrección">
    <Aparece delay={10}>
      <Tarjeta tono={C.ok}>
        <Etiqueta texto="VERSIÓN 2" color="#1f8f68" />
        <div style={{ fontFamily: mono, fontSize: 22, color: "#3d4a63", marginTop: 12, lineHeight: 1.45 }}>
          2 registros corregidos · 1 alerta justificada
        </div>
        <Dato k="motivo" v="corrección de documento" />
      </Tarjeta>
    </Aparece>
    <Aparece delay={30} estilo={{ marginTop: 20 }}>
      <Tarjeta>
        <div style={{ fontFamily: mono, fontSize: 17, letterSpacing: 1.4, color: "#7b879d" }}>HISTORIAL</div>
        <Dato k="versión 1" v="CON_ERRORES" color={C.error} />
        <Dato k="versión 2" v="RECIBIDA" color={C.teal} />
      </Tarjeta>
      <Boton texto="Revalidar" tono={C.ok} />
    </Aparece>
  </Pantalla>
);

const Listo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sello = spring({ frame: frame - 20, fps, config: { damping: 11, stiffness: 140 } });
  return (
    <AbsoluteFill style={{ justifyContent: "center", padding: "0 110px 320px" }}>
      <Marca display={display} tamano={112} sub="RESULTADO FINAL" />
      <Aparece delay={6}>
        <h1
          style={{
            fontFamily: display,
            fontSize: 96,
            fontWeight: 700,
            color: C.text,
            letterSpacing: -3,
            lineHeight: 1.02,
            margin: "24px 0 0",
          }}
        >
          Planilla lista
          <br />
          para presentar
        </h1>
      </Aparece>
      <div
        style={{
          marginTop: 34,
          alignSelf: "flex-start",
          transform: `scale(${interpolate(sello, [0, 1], [0.7, 1])})`,
          opacity: sello,
          border: `3px solid ${C.ok}`,
          background: `${C.ok}1c`,
          borderRadius: 8,
          padding: "20px 34px",
          fontFamily: mono,
          fontSize: 56,
          letterSpacing: 3,
          color: C.ok,
        }}
      >
        PREVALIDADA
      </div>
      <Aparece delay={40}>
        <p style={{ fontFamily: mono, fontSize: 30, color: C.muted, marginTop: 34, lineHeight: 1.5 }}>
          Sin filas, sin rechazos y con el historial de cada versión guardado.
        </p>
      </Aparece>
    </AbsoluteFill>
  );
};

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

const Escena: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
  const e = escena(id);
  return (
    <Sequence from={e.inicio} durationInFrames={e.dur}>
      {children}
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
    <Escena id="apis">
      <ApisMovil />
    </Escena>
    <Escena id="cargar">
      <Cargar />
    </Escena>
    <Escena id="validando">
      <Validando />
    </Escena>
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

    <MarcaAgua display={display} escala={1.7} />
    <Subtitulos lineas={ESCENAS.flatMap((e) => e.lineas)} ancho={880} tamano={34} abajo={110} />
  </AbsoluteFill>
);
