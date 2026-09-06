import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { loadFont as loadDisplay } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadMono } from "@remotion/google-fonts/IBMPlexMono";
import { Fondo } from "./components/Fondo";
import { Subtitulos } from "./components/Subtitulos";
import { Intro } from "./scenes/Intro";
import { PasoApi, type DatosPaso } from "./scenes/PasoApi";
import { HallazgoScene } from "./scenes/Hallazgo";
import { Cierre } from "./scenes/Cierre";
import { Apis } from "./scenes/Apis";
import { Seguridad } from "./scenes/Seguridad";
import { Correccion } from "./scenes/Correccion";
import { MarcaAgua } from "./components/Marca";
import { AUDIO, ESCENAS, TOTAL, escena } from "./guion-tutorial";
import { C } from "./theme";

const { fontFamily: display } = loadDisplay("normal", { weights: ["700"], subsets: ["latin"] });
loadMono("normal", { weights: ["400", "600"], subsets: ["latin"] });

export const DURACION_TOTAL = TOTAL;

const PASO1: DatosPaso = {
  paso: "PASO 1",
  sub: "AUTENTICACIÓN DE LA SESIÓN",
  titulo: "Abrir la sesión y fijar el empleador",
  metodo: "POST",
  ruta: "/api/v1/recepcion/sesion",
  envio: ['{ "usuarioDemoId": "elaborador-01" }'],
  respuestaTitulo: "Resultado",
  respuesta: ['{ "sesionId": "ses-9f2c…",', '  "rol": "Elaborador",', '  "empleadorId": "EMP-DEMO-001" }'],
  quehacer: "Guarde el sesionId: el empleador lo fija el servidor, nunca el cliente.",
};

const PASO2: DatosPaso = {
  paso: "PASO 2",
  sub: "RECEPCIÓN DEL ARCHIVO",
  titulo: "Enviar la planilla en CSV",
  metodo: "POST",
  ruta: "/api/v1/recepcion/solicitudes",
  envio: ["archivo: planilla.csv (UTF-8)", 'periodo: "2026-02"', "Idempotency-Key: …"],
  respuestaTitulo: "Resultado",
  respuesta: ['{ "solicitudId": "sol-3b71…",', '  "planillaId": "pl-77ad…",', '  "version": 1,', '  "estado": "RECIBIDA" }'],
  quehacer: "Use la plantilla CSV v1.0 sin renombrar columnas y conserve el planillaId.",
};

const PASO3: DatosPaso = {
  paso: "PASO 3",
  sub: "MOTOR DE REGLAS · NIVELES A–F",
  titulo: "Ejecutar la validación",
  metodo: "POST",
  ruta: "/api/v1/validacion/ejecuciones",
  envio: ['{ "planillaId": "pl-77ad…",', '  "incluirHistorico": true }'],
  respuestaTitulo: "Resultado",
  respuesta: ['{ "estado": "CON_ERRORES",', '  "resumen": { "errores": 6,', '               "alertas": 5,', '               "validos": 2 } }'],
  tono: C.error,
  quehacer: "Si el estado es CON_ERRORES, la planilla aún no se puede dar por prevalidada.",
};

const PASO5: DatosPaso = {
  paso: "PASO 5",
  sub: "CORREGIR Y CONFIRMAR",
  titulo: "Nueva versión y justificaciones",
  metodo: "POST",
  ruta: "/api/v1/recepcion/solicitudes/{id}/versiones",
  envio: ["{ registrosCorregidos: [ … ],", '  "motivo": "corrección de documento" }'],
  respuestaTitulo: "Resultado",
  respuesta: ['{ "version": 2,', '  "planillaOrigenId": "pl-77ad…",', '  "estado": "RECIBIDA" }'],
  tono: C.ok,
  quehacer: "La versión anterior nunca se sobrescribe: vuelva al Paso 3 para revalidar la v2.",
};

const rel = (id: string, i: number, respaldo: number) => {
  const e = escena(id);
  const l = e.lineas[i];
  return l ? Math.max(0, l.inicio - e.inicio) : respaldo;
};

const retrasosPaso = (id: string) => ({
  envio: rel(id, 0, 20) + 18,
  respuesta: rel(id, 1, 40),
  quehacer: rel(id, 2, 56),
});

const Escena: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
  const e = escena(id);
  return (
    <Sequence from={e.inicio} durationInFrames={e.dur}>
      {children}
    </Sequence>
  );
};

const TODAS_LAS_LINEAS = ESCENAS.flatMap((e) => e.lineas);

export const MainVideo: React.FC = () => (
  <AbsoluteFill>
    <Fondo />
    <Audio src={staticFile(AUDIO)} />

    <Escena id="intro">
      <Intro display={display} />
    </Escena>
    <Escena id="apis">
      <Apis display={display} retrasos={{ dos: rel("apis", 1, 34), nota: rel("apis", 2, 60) }} />
    </Escena>
    <Escena id="seguridad">
      <Seguridad display={display} />
    </Escena>
    <Escena id="paso1">
      <PasoApi datos={PASO1} display={display} retrasos={retrasosPaso("paso1")} />
    </Escena>
    <Escena id="paso2">
      <PasoApi datos={PASO2} display={display} retrasos={retrasosPaso("paso2")} />
    </Escena>
    <Escena id="paso3">
      <PasoApi datos={PASO3} display={display} retrasos={retrasosPaso("paso3")} />
    </Escena>
    <Escena id="paso4">
      <HallazgoScene
        display={display}
        retrasos={{ alerta: rel("paso4", 1, 30), nota: rel("paso4", 2, 52) }}
      />
    </Escena>
    <Escena id="correccion">
      <Correccion
        display={display}
        retrasos={{ arreglo: rel("correccion", 2, 60), alerta: rel("correccion", 3, 100) }}
      />
    </Escena>
    <Escena id="paso5">
      <PasoApi datos={PASO5} display={display} retrasos={retrasosPaso("paso5")} />
    </Escena>
    <Escena id="cierre">
      <Cierre display={display} />
    </Escena>

    <MarcaAgua display={display} />
    <Subtitulos lineas={TODAS_LAS_LINEAS} />
  </AbsoluteFill>
);
