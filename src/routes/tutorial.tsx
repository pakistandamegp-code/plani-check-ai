import { createFileRoute, Link } from "@tanstack/react-router";
import { Sitio } from "@/components/sitio/Sitio";
import { Reproductor } from "@/components/sitio/Reproductor";
import videoApi from "@/assets/tutorial-api.mp4.asset.json";
import videoMovil from "@/assets/tutorial-movil.mp4.asset.json";

export const Route = createFileRoute("/tutorial")({
  head: () => ({
    meta: [
      { title: "Videos: usar la API de prevalidación paso a paso" },
      {
        name: "description",
        content:
          "Dos videos narrados en español: el flujo completo de la API de prevalidación de planillas y el mismo proceso visto desde un teléfono, con los resultados y qué hacer en cada caso.",
      },
      { property: "og:title", content: "Videos: la API de prevalidación paso a paso" },
      {
        property: "og:description",
        content: "Sesión, envío del CSV, validación, lectura de hallazgos y nueva versión corregida, explicados en video con voz y subtítulos.",
      },
      { property: "og:type", content: "video.other" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Tutorial,
});


const PASOS = [
  {
    n: "1",
    titulo: "Abrir la sesión",
    llamada: "POST /api/v1/recepcion/sesion",
    resultado: "Devuelve el identificador de sesión, su rol y el empleador que le corresponde.",
    quehacer: "Guarde ese identificador: el empleador lo fija el servidor, nunca quien envía la planilla.",
  },
  {
    n: "2",
    titulo: "Enviar la planilla",
    llamada: "POST /api/v1/recepcion/solicitudes",
    resultado: "Devuelve la solicitud, la planilla y la versión 1 en estado RECIBIDA.",
    quehacer: "Use la plantilla CSV sin renombrar columnas y conserve el identificador de la planilla.",
  },
  {
    n: "3",
    titulo: "Ejecutar la validación",
    llamada: "POST /api/v1/validacion/ejecuciones",
    resultado: "Devuelve el estado y el resumen: errores bloqueantes, alertas y registros válidos.",
    quehacer: "Si el estado es CON_ERRORES, la planilla todavía no se puede dar por prevalidada.",
  },
  {
    n: "4",
    titulo: "Leer los hallazgos",
    llamada: "GET /api/v1/validacion/planillas/{id}/hallazgos",
    resultado: "Cada hallazgo indica la fila, el dato revisado, el valor recibido y la regla aplicada.",
    quehacer: "Un error se corrige; una alerta se puede confirmar con una justificación escrita.",
  },
  {
    n: "5",
    titulo: "Corregir y revalidar",
    llamada: "POST /api/v1/recepcion/solicitudes/{id}/versiones",
    resultado: "Crea la versión 2 sin borrar la anterior y la deja lista para volver a validarse.",
    quehacer: "Repita el paso 3 con la nueva versión hasta que la planilla quede PREVALIDADA.",
  },
];

function Tutorial() {
  return (
    <Sitio>
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Videos explicativos</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Cómo usar nuestra API, paso a paso
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Dos videos narrados en español y con subtítulos: el flujo completo de la API con el resultado de cada
            llamada, y el mismo proceso visto desde un teléfono, de la carga hasta la planilla prevalidada.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="rounded-sm bg-primary px-2.5 py-1 font-mono text-xs font-semibold text-primary-foreground">
              Video 1
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">La API paso a paso</h2>
            <span className="font-mono text-xs text-muted-foreground">2 min 10 s · con voz y subtítulos</span>
          </div>
          <div className="shadow-sm">
            <Reproductor src={videoApi.url} titulo="La API paso a paso" />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Todo lo dicho aparece también en pantalla y está transcrito más abajo.
          </p>
        </div>

        <div className="mt-14 border-t border-border pt-14">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="rounded-sm bg-primary px-2.5 py-1 font-mono text-xs font-semibold text-primary-foreground">
              Video 2
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Desde el iPhone</h2>
            <span className="font-mono text-xs text-muted-foreground">con voz y subtítulos</span>
          </div>
          <div className="grid gap-8 lg:grid-cols-[minmax(280px,360px)_1fr] lg:items-center">
            <div className="mx-auto w-full max-w-[360px] shadow-sm">
              <Reproductor src={videoMovil.url} titulo="Recorrido desde el iPhone" vertical />
            </div>
            <div>
              <p className="text-base leading-relaxed text-muted-foreground">
                Vea el proceso completo dentro de un iPhone: cargar la planilla, seguir la validación de cada nivel,
                corregir los hallazgos y enviar una nueva versión protegida.
              </p>
              <Link
                to="/demo/errores"
                className="mt-5 inline-block rounded-sm border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                Ver la bandeja de errores real
              </Link>
            </div>
          </div>
        </div>

        <h2 className="mt-12 text-2xl font-bold tracking-tight text-foreground">Los cinco pasos, en texto</h2>

        <ol className="mt-6 space-y-4">
          {PASOS.map((p) => (
            <li key={p.n} className="rounded-md border border-border bg-card p-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-sm bg-primary font-mono text-sm font-semibold text-primary-foreground">
                  {p.n}
                </span>
                <h3 className="text-lg font-semibold text-foreground">{p.titulo}</h3>
                <code className="rounded-sm bg-secondary px-2 py-1 font-mono text-xs text-muted-foreground">
                  {p.llamada}
                </code>
              </div>
              <p className="mt-3 text-sm text-foreground">
                <span className="font-semibold">Resultado: </span>
                {p.resultado}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                <span className="font-semibold">Qué hacer: </span>
                {p.quehacer}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            to="/demo/errores"
            className="rounded-sm bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Ver errores y cómo arreglarlos
          </Link>
          <Link
            to="/demo/cargar"
            className="rounded-sm border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            Probar la demo
          </Link>
        </div>
      </section>
    </Sitio>
  );
}
