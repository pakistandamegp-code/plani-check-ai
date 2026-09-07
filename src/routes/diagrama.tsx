import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/diagrama")({
  head: () => ({
    meta: [
      { title: "Diagrama del proceso — documento interno" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Vista interna del proceso de la propuesta con historias de usuario y product backlog." },
      { property: "og:title", content: "Diagrama del proceso — documento interno" },
      { property: "og:description", content: "Vista interna del proceso de la propuesta." },
    ],
  }),
  component: Diagrama,
});

type Fase = {
  id: string;
  n: string;
  titulo: string;
  detalle: string;
  hu: { id: string; texto: string };
  pb: { id: string; texto: string };
  tipo?: "fase" | "decision" | "final";
};

type Bloque = {
  id: string;
  n: string;
  nombre: string;
  resumen: string;
  fases: Fase[];
};

const BLOQUES: Bloque[] = [
  {
    id: "b1",
    n: "01",
    nombre: "Definición de la propuesta",
    resumen: "Qué problema se resuelve, con qué respaldo legal y con qué datos.",
    fases: [
      {
        id: "f1",
        n: "F1",
        titulo: "Planteamiento",
        detalle: "Problema, Caso 7, alcance del Sprint 1 y límites declarados del MVP.",
        hu: { id: "HU-01", texto: "Como equipo, quiero delimitar el alcance para no prometer lo que el MVP no hace." },
        pb: { id: "PB-01", texto: "Documento de caso, propósito, supuestos y limitaciones." },
      },
      {
        id: "f2",
        n: "F2",
        titulo: "Marco normativo",
        detalle: "Ley 51 de 2005 art. 87, Ley 81 de 2019 y Decreto Ejecutivo 285 de 2021.",
        hu: { id: "HU-02", texto: "Como analista, quiero saber qué ley respalda cada regla de validación." },
        pb: { id: "PB-02", texto: "Matriz regla → ley → artículo." },
      },
      {
        id: "f3",
        n: "F3",
        titulo: "Modelo de datos",
        detalle: "Campos, tipos, obligatoriedad y contrato CSV versionado.",
        hu: { id: "HU-03", texto: "Como empleador, quiero saber qué columnas debe traer el archivo." },
        pb: { id: "PB-03", texto: "Diccionario de datos y plantilla CSV de ejemplo." },
      },
    ],
  },
  {
    id: "b2",
    n: "02",
    nombre: "Construcción de la solución",
    resumen: "Las reglas y las dos APIs lógicas que sostienen la prevalidación.",
    fases: [
      {
        id: "f4",
        n: "F4",
        titulo: "Reglas de validación",
        detalle: "Catálogo por niveles A a F, del formato al cruce entre campos.",
        hu: { id: "HU-04", texto: "Como empleador, quiero revisar la planilla antes de enviarla a la CSS." },
        pb: { id: "PB-04", texto: "Catálogo de reglas y matriz campo → regla." },
      },
      {
        id: "f5",
        n: "F5",
        titulo: "API de recepción",
        detalle: "Sesión, carga del archivo y gestión de la solicitud.",
        hu: { id: "HU-05", texto: "Como empleador, quiero cargar mi planilla en CSV sin fricción." },
        pb: { id: "PB-05", texto: "Sesión demo, idempotencia y sanitización de la carga." },
      },
      {
        id: "f6",
        n: "F6",
        titulo: "API de validación",
        detalle: "Motor de reglas y devolución de resultados explicables.",
        hu: { id: "HU-06", texto: "Como empleador, quiero ver fila, campo y motivo de cada fallo." },
        pb: { id: "PB-06", texto: "Motor A–F con hallazgos explicables." },
      },
    ],
  },
  {
    id: "b3",
    n: "03",
    nombre: "Ejecución del proceso",
    resumen: "Qué ocurre según el resultado: corregir, justificar o dar por prevalidada.",
    fases: [
      {
        id: "d1",
        n: "D",
        titulo: "Resultado de la validación",
        detalle: "Tres caminos: error bloqueante, alerta o sin hallazgos.",
        hu: { id: "HU-06", texto: "Como empleador, quiero entender de inmediato si puedo enviar o no." },
        pb: { id: "PB-06", texto: "Semáforo de resultado y resumen por niveles." },
        tipo: "decision",
      },
      {
        id: "f7",
        n: "F7",
        titulo: "Corrección y versionado",
        detalle: "Se corrige y se reenvía como versión nueva enlazada a la anterior. Vuelve a F6.",
        hu: { id: "HU-07", texto: "Como empleador, quiero corregir sin perder la versión anterior." },
        pb: { id: "PB-07", texto: "Versión enlazada y motivo de cambio." },
      },
      {
        id: "f7b",
        n: "F7b",
        titulo: "Justificación de alerta",
        detalle: "Una alerta no bloquea: se confirma con justificación del rol autorizado.",
        hu: { id: "HU-08", texto: "Como analista, quiero confirmar una alerta justificada." },
        pb: { id: "PB-08", texto: "Permiso de justificación por rol." },
      },
      {
        id: "f8",
        n: "F8",
        titulo: "Planilla prevalidada",
        detalle: "Estado final del flujo dentro del alcance del MVP.",
        hu: { id: "HU-09", texto: "Como empleador, quiero una constancia de planilla prevalidada." },
        pb: { id: "PB-09", texto: "Estado final y comprobante." },
        tipo: "final",
      },
    ],
  },
  {
    id: "b4",
    n: "04",
    nombre: "Control y cierre del Sprint 1",
    resumen: "Trazabilidad, seguridad teórica, pruebas documentadas y cierre.",
    fases: [
      {
        id: "f9",
        n: "F9",
        titulo: "Trazabilidad y auditoría",
        detalle: "Quién hizo qué y cuándo, con acceso por rol y por empleador.",
        hu: { id: "HU-10", texto: "Como auditor, quiero ver quién hizo qué y cuándo." },
        pb: { id: "PB-10", texto: "Bitácora y control de acceso por rol y empresa." },
      },
      {
        id: "f10",
        n: "F10",
        titulo: "Seguridad teórica",
        detalle: "Riesgos del entorno, requisitos y controles propuestos.",
        hu: { id: "HU-11", texto: "Como responsable, quiero proteger los datos personales tratados." },
        pb: { id: "PB-11", texto: "Minimización, enmascarado y separación de ambientes." },
      },
      {
        id: "f11",
        n: "F11",
        titulo: "Pruebas documentadas",
        detalle: "Casos diseñados bajo ISO/IEC/IEEE 29119-3:2021, sin resultados de ejecución.",
        hu: { id: "HU-12", texto: "Como QA, quiero casos de prueba trazables a cada regla." },
        pb: { id: "PB-12", texto: "Casos diseñados sin marcar aprobado/fallido." },
      },
      {
        id: "f12",
        n: "F12",
        titulo: "Cierre del sprint",
        detalle: "Review, retrospectiva y paso al Sprint 2: anomalías, ERP, integración y escala.",
        hu: { id: "HU-13", texto: "Como equipo, quiero cerrar el sprint con acuerdos y siguientes pasos." },
        pb: { id: "PB-13", texto: "Acta de review y retrospectiva." },
        tipo: "final",
      },
    ],
  },
];

const TODAS = BLOQUES.flatMap((b) => b.fases.map((f) => ({ ...f, bloque: b })));

function Diagrama() {
  const [activa, setActiva] = useState<string>("f1");
  const [filtro, setFiltro] = useState<string>("todos");
  const [verHistorias, setVerHistorias] = useState(true);

  const seleccion = useMemo(() => TODAS.find((f) => f.id === activa) ?? TODAS[0], [activa]);
  const bloques = filtro === "todos" ? BLOQUES : BLOQUES.filter((b) => b.id === filtro);

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-ink text-ink-foreground">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-teal">Documento interno · no listado</p>
          <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
            Proceso de la propuesta, historia de usuario y product backlog
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-ink-foreground/70">
            Cada fase del proceso está unida a la historia de usuario que la origina y al elemento del
            backlog que la entrega. Haga clic en una fase para ver el detalle.
          </p>
        </div>
      </header>

      <div className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-3 sm:px-6">
          <Chip activo={filtro === "todos"} onClick={() => setFiltro("todos")}>
            Todo el proceso
          </Chip>
          {BLOQUES.map((b) => (
            <Chip key={b.id} activo={filtro === b.id} onClick={() => setFiltro(b.id)}>
              {b.n} · {b.nombre}
            </Chip>
          ))}
          <button
            type="button"
            onClick={() => setVerHistorias((v) => !v)}
            className="ml-auto rounded-sm border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary"
          >
            {verHistorias ? "Ocultar HU y PB" : "Mostrar HU y PB"}
          </button>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-8">
          {bloques.map((b) => (
            <section key={b.id} className="rounded-lg border border-border bg-card p-5 shadow-sm">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs font-semibold text-teal">{b.n}</span>
                <h2 className="font-display text-lg font-semibold text-foreground">{b.nombre}</h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{b.resumen}</p>

              <ol className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {b.fases.map((f) => {
                  const on = f.id === activa;
                  const acento =
                    f.tipo === "decision"
                      ? "border-gold"
                      : f.tipo === "final"
                        ? "border-estado-valido"
                        : "border-teal";
                  return (
                    <li key={f.id}>
                      <button
                        type="button"
                        onClick={() => setActiva(f.id)}
                        aria-pressed={on}
                        className={`group h-full w-full rounded-md border-l-4 ${acento} border-y border-r border-border bg-background p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${
                          on ? "ring-2 ring-teal shadow-md" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                            {f.n}
                          </span>
                          {f.tipo === "decision" && (
                            <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] font-semibold text-gold-foreground">
                              decisión
                            </span>
                          )}
                          {f.tipo === "final" && (
                            <span className="rounded-full bg-estado-valido px-2 py-0.5 text-[10px] font-semibold text-white">
                              resultado
                            </span>
                          )}
                        </div>
                        <p className="mt-1 font-medium text-foreground">{f.titulo}</p>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{f.detalle}</p>

                        {verHistorias && (
                          <div className="mt-3 space-y-1.5 border-t border-dashed border-border pt-3">
                            <p className="text-[11px] leading-snug text-muted-foreground">
                              <span className="font-mono font-semibold text-teal">{f.hu.id}</span> {f.hu.texto}
                            </p>
                            <p className="text-[11px] leading-snug text-muted-foreground">
                              <span className="font-mono font-semibold text-gold">{f.pb.id}</span> {f.pb.texto}
                            </p>
                          </div>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ol>

              {b.id === "b3" && (
                <p className="mt-4 rounded-sm border border-border bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">
                  El ciclo se cierra: la corrección (F7) se reenvía como versión nueva y vuelve a la
                  validación (F6) hasta quedar sin hallazgos bloqueantes.
                </p>
              )}
            </section>
          ))}
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-teal">
              {seleccion.bloque.n} · {seleccion.bloque.nombre}
            </p>
            <h3 className="mt-2 font-display text-xl font-semibold text-foreground">
              {seleccion.n} — {seleccion.titulo}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{seleccion.detalle}</p>

            <div className="mt-5 rounded-md border-l-4 border-teal bg-background p-4">
              <p className="font-mono text-xs font-semibold text-teal">{seleccion.hu.id} · historia de usuario</p>
              <p className="mt-1 text-sm text-foreground">{seleccion.hu.texto}</p>
            </div>
            <div className="mt-3 rounded-md border-l-4 border-gold bg-background p-4">
              <p className="font-mono text-xs font-semibold text-gold">{seleccion.pb.id} · product backlog</p>
              <p className="mt-1 text-sm text-foreground">{seleccion.pb.texto}</p>
            </div>

            <p className="mt-5 text-xs text-muted-foreground">
              Los identificadores HU y PB son los que usa este documento. Si el backlog oficial usa otra
              numeración, se sustituye tal cual.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}

function Chip({
  activo,
  onClick,
  children,
}: {
  activo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-sm border px-3 py-1.5 text-xs font-medium transition-colors ${
        activo
          ? "border-teal bg-teal text-teal-foreground"
          : "border-border bg-background text-muted-foreground hover:bg-secondary"
      }`}
    >
      {children}
    </button>
  );
}
