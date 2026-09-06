import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ClipboardCheck,
  FileSpreadsheet,
  GitBranch,
  History,
  Layers,
  Lock,
  ScrollText,
  ShieldAlert,
} from "lucide-react";
import { Nota, Seccion, Sitio } from "@/components/sitio/Sitio";
import heroImg from "@/assets/hero-prevalidacion.jpg";
import { AVISO_MVP, AVISO_PREVALIDADA } from "@/lib/prevalidacion/seguridad";
import { NIVELES } from "@/lib/prevalidacion/reglas";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Prevalida Planillas — Demo de prevalidación para empleadores" },
      {
        name: "description",
        content:
          "MVP demostrativo que detecta errores en planillas de empleadores antes de su presentación formal, con reglas explicables y datos sintéticos.",
      },
      { property: "og:title", content: "Prevalida Planillas — Demo de prevalidación para empleadores" },
      {
        property: "og:description",
        content:
          "Valida estructura, identidad, salario, consistencia e histórico de planillas con datos ficticios. Demostración académica.",
      },
    ],
  }),
  component: Inicio,
});

const CAPACIDADES = [
  {
    icono: FileSpreadsheet,
    titulo: "Carga CSV con plantilla",
    texto: "Formato UTF-8 versionado, plantilla descargable y sanitización de cada celda antes de procesar.",
  },
  {
    icono: Layers,
    titulo: "Validación por niveles",
    texto: "Estructura, identidad, consistencia laboral, relaciones entre campos, rubros normativos e histórico.",
  },
  {
    icono: ShieldAlert,
    titulo: "Clasificación explicable",
    texto: "Cada hallazgo indica regla, versión, severidad, fundamento y acción sugerida, sin atribuir conductas.",
  },
  {
    icono: GitBranch,
    titulo: "Corrección versionada",
    texto: "Una corrección genera una nueva versión enlazada con la anterior; nada se sobrescribe.",
  },
  {
    icono: History,
    titulo: "Historial y auditoría",
    texto: "Bitácora de cargas, validaciones, correcciones, confirmaciones y accesos denegados.",
  },
  {
    icono: ScrollText,
    titulo: "Trazabilidad normativa",
    texto: "Cada regla se enlaza con su fundamento documentado y su estado de madurez.",
  },
];

const ESTADOS = [
  { nombre: "RECIBIDA", texto: "La solicitud fue registrada con su identificador y huella de integridad." },
  { nombre: "EN VALIDACIÓN", texto: "Se están aplicando las reglas configuradas y vigentes." },
  { nombre: "CON ERRORES", texto: "Existe al menos un error bloqueante que debe corregirse." },
  { nombre: "EN REVISIÓN", texto: "Hay alertas que requieren confirmación o justificación." },
  { nombre: "PREVALIDADA", texto: "Superó los controles internos configurados en la plataforma." },
];

function Inicio() {
  return (
    <Sitio>
      <section className="relative overflow-hidden border-b border-border bg-ink text-ink-foreground">
        <div className="absolute inset-0 opacity-[0.07] malla-institucional" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
          <div className="min-w-0">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-teal">
              Caso 7 · CSS y empleadores · Sprint 1
            </p>
            <h1 className="mt-4 text-3xl font-semibold leading-[1.1] sm:text-5xl">
              Detecte los errores de la planilla antes de que cuesten un reproceso.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-foreground/75">
              Plataforma demostrativa de prevalidación: recibe la planilla del empleador, aplica reglas
              de estructura, identidad, salario, consistencia e histórico, y devuelve hallazgos
              explicables con su fundamento y acción sugerida.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/demo/cargar"
                className="inline-flex items-center gap-2 rounded-sm bg-teal px-5 py-3 text-sm font-semibold text-teal-foreground transition-colors hover:bg-teal/90"
              >
                Probar la demo <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/arquitectura"
                className="inline-flex items-center gap-2 rounded-sm border border-white/20 px-5 py-3 text-sm font-semibold text-ink-foreground transition-colors hover:bg-white/10"
              >
                Ver arquitectura y APIs
              </Link>
            </div>
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-white/10 pt-6">
              {[
                { k: "18", v: "reglas catalogadas" },
                { k: "6", v: "niveles de validación" },
                { k: "5", v: "estados del ciclo" },
              ].map((s) => (
                <div key={s.v}>
                  <dt className="font-display text-2xl font-semibold text-teal">{s.k}</dt>
                  <dd className="text-xs text-ink-foreground/65">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="min-w-0">
            <img
              src={heroImg}
              alt="Representación abstracta de capas de validación de datos de planilla"
              className="w-full rounded-sm border border-white/10 shadow-2xl"
              loading="eager"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
        <Nota tono="alerta">
          <strong className="font-semibold">Aviso importante. </strong>
          {AVISO_PREVALIDADA} {AVISO_MVP}
        </Nota>
      </div>

      <Seccion
        eyebrow="Qué resuelve"
        titulo="Calidad de la información antes del proceso formal"
        descripcion="Una planilla puede cumplir el formato y aún contener información incorrecta. La prevalidación combina reglas objetivas, contexto histórico y confirmación humana, sin sustituir la competencia legal de la autoridad correspondiente."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CAPACIDADES.map((c) => (
            <article key={c.titulo} className="bisel-superior rounded-sm border border-border bg-surface p-6">
              <c.icono className="h-6 w-6 text-teal" aria-hidden />
              <h3 className="mt-4 text-base font-semibold">{c.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.texto}</p>
            </article>
          ))}
        </div>
      </Seccion>

      <div className="border-y border-border bg-surface-2">
        <Seccion
          eyebrow="Modelo de validación"
          titulo="Seis niveles, cada uno con una pregunta distinta"
          descripcion="Cada nivel usa solo las fuentes necesarias. Una regla que depende de una fuente no disponible se declara limitada o pendiente: la demo no simula verificaciones institucionales."
        >
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {NIVELES.map((n) => (
              <div key={n.nivel} className="rounded-sm border border-border bg-surface p-5">
                <span className="font-mono text-xs font-semibold text-teal">NIVEL {n.nivel}</span>
                <h3 className="mt-1 text-base font-semibold">{n.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{n.objetivo}</p>
              </div>
            ))}
          </div>
        </Seccion>
      </div>

      <Seccion
        eyebrow="Ciclo de vida"
        titulo="Estados internos que describen el recorrido de la solicitud"
        descripcion="Los estados evitan confundir la prevalidación con una aprobación institucional."
      >
        <ol className="grid gap-3 lg:grid-cols-5">
          {ESTADOS.map((e, i) => (
            <li key={e.nombre} className="rounded-sm border border-border bg-surface p-5">
              <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
              <h3 className="mt-1 font-mono text-sm font-semibold text-foreground">{e.nombre}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{e.texto}</p>
            </li>
          ))}
        </ol>
      </Seccion>

      <div className="border-y border-border bg-surface-2">
        <Seccion
          eyebrow="Seguridad desde el diseño"
          titulo="Controles aplicados en la propia demostración"
          descripcion="La demo trabaja únicamente con datos sintéticos en el navegador y aplica controles verificables."
        >
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icono: Lock, t: "Aislamiento por empleador", d: "Cada sesión solo consulta su empresa; el intento cruzado se deniega y queda en bitácora." },
              { icono: ClipboardCheck, t: "Entrada saneada", d: "Límite de tipo y tamaño de archivo, neutralización de fórmulas y caracteres de control." },
              { icono: ShieldAlert, t: "Minimización", d: "Los listados muestran iniciales y documentos parcialmente enmascarados." },
            ].map((c) => (
              <div key={c.t} className="rounded-sm border border-border bg-surface p-6">
                <c.icono className="h-6 w-6 text-teal" aria-hidden />
                <h3 className="mt-4 text-base font-semibold">{c.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
              </div>
            ))}
          </div>
        </Seccion>
      </div>

    </Sitio>
  );
}
