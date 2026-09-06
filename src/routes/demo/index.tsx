import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileSpreadsheet, ListChecks, Wrench } from "lucide-react";
import { Sitio } from "@/components/sitio/Sitio";
import {
  AvisoLegalDemo,
  Detalles,
  EncabezadoDemo,
  EtiquetaEstado,
  SelectorSesion,
  Tarjeta,
} from "@/components/demo/comunes";
import { usePrevalidacion } from "@/lib/prevalidacion/store";
import { resumenHallazgos } from "@/lib/prevalidacion/motor";
import { formatoBalboas, totalSueldos } from "@/lib/prevalidacion/datos";

export const Route = createFileRoute("/demo/")({
  head: () => ({
    meta: [
      { title: "Demo guiada de prevalidación de planillas en 3 pasos" },
      {
        name: "description",
        content:
          "Recorrido guiado: cargue una planilla de ejemplo, vea los hallazgos explicados y corrija para volver a validar.",
      },
      { property: "og:title", content: "Demo guiada de prevalidación en 3 pasos" },
      {
        property: "og:description",
        content: "Cargue, revise los hallazgos y corrija: la demo con datos ficticios en tres pasos.",
      },
    ],
  }),
  component: Tablero,
});

const PASOS = [
  {
    icono: FileSpreadsheet,
    titulo: "Cargue una planilla",
    texto:
      "No necesita preparar nada: use el archivo de ejemplo que ya trae errores y alertas a propósito.",
    to: "/demo/cargar",
    cta: "Empezar aquí",
    principal: true,
  },
  {
    icono: ListChecks,
    titulo: "Vea qué salió mal",
    texto: "Cada fila con problema se explica en palabras sencillas, con el valor recibido y qué corregir.",
    to: "/demo/planillas",
    cta: "Ver resultados",
    principal: false,
  },
  {
    icono: Wrench,
    titulo: "Corrija y vuelva a validar",
    texto: "Ajuste los valores, genere una nueva versión y compare. Todo el recorrido queda registrado.",
    to: "/demo/errores",
    cta: "Ver errores y soluciones",
    principal: false,
  },
] as const;

function Tablero() {
  const { listo, planillasVisibles, usuario } = usePrevalidacion();

  const totalErrores = planillasVisibles.reduce((a, p) => a + resumenHallazgos(p.hallazgos).errores, 0);
  const totalAlertas = planillasVisibles.reduce((a, p) => a + resumenHallazgos(p.hallazgos).alertas, 0);
  const prevalidadas = planillasVisibles.filter((p) => p.estado === "PREVALIDADA").length;
  const registros = planillasVisibles.reduce((a, p) => a + p.registros.length, 0);
  const masa = planillasVisibles.reduce((a, p) => a + totalSueldos(p.registros), 0);

  return (
    <Sitio>
      <EncabezadoDemo
        titulo="Demostración en 3 pasos"
        descripcion="Una planilla de ejemplo pasa por las reglas de validación y usted ve, en lenguaje claro, qué está bien y qué hay que corregir."
      />
      <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6">
        <ol className="grid gap-4 md:grid-cols-3">
          {PASOS.map((p, i) => {
            const Icono = p.icono;
            return (
              <li
                key={p.titulo}
                className={
                  p.principal
                    ? "flex flex-col rounded-sm border-2 border-teal bg-surface p-6"
                    : "flex flex-col rounded-sm border border-border bg-surface p-6"
                }
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-sm bg-teal/15 text-teal">
                    <Icono className="h-5 w-5" />
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">Paso {i + 1}</span>
                </div>
                <h2 className="mt-4 text-base font-semibold">{p.titulo}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{p.texto}</p>
                <Link
                  to={p.to}
                  className={
                    p.principal
                      ? "mt-5 inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                      : "mt-5 inline-flex items-center gap-2 text-sm font-semibold text-teal hover:underline"
                  }
                >
                  {p.cta} <ArrowRight className="h-4 w-4" />
                </Link>
              </li>
            );
          })}
        </ol>

        {!listo ? (
          <p className="text-sm text-muted-foreground">Cargando datos de demostración…</p>
        ) : (
          <>
            <Detalles titulo="Planillas ya cargadas en la demo" nota={`${planillasVisibles.length} visibles`}>
              <ul className="divide-y divide-border">
                {planillasVisibles.slice(0, 5).map((p) => {
                  const r = resumenHallazgos(p.hallazgos);
                  return (
                    <li key={p.id} className="grid gap-2 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                      <div className="min-w-0">
                        <Link
                          to="/demo/planillas/$planillaId"
                          params={{ planillaId: p.id }}
                          className="block truncate text-sm font-semibold hover:underline"
                        >
                          {p.empleadorNombre} · {p.periodo} · v{p.version}
                        </Link>
                        <p className="mt-1 font-mono text-xs text-muted-foreground">
                          {r.errores} errores · {r.alertas} alertas · {p.registros.length} registros
                        </p>
                      </div>
                      <EtiquetaEstado estado={p.estado} />
                    </li>
                  );
                })}
                {planillasVisibles.length === 0 && (
                  <li className="py-4 text-sm text-muted-foreground">Su sesión no tiene planillas visibles.</li>
                )}
              </ul>
              <Link to="/demo/planillas" className="inline-block text-sm font-semibold text-teal hover:underline">
                Ver todas las planillas →
              </Link>
            </Detalles>

            <Detalles titulo="Indicadores y volumen procesado" nota="resumen numérico">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Tarjeta titulo="Planillas visibles" valor={planillasVisibles.length} detalle={`Rol: ${usuario.rol}`} />
                <Tarjeta titulo="Errores bloqueantes" valor={totalErrores} tono="error" detalle="Deben corregirse" />
                <Tarjeta
                  titulo="Alertas pendientes"
                  valor={totalAlertas}
                  tono="alerta"
                  detalle="Requieren confirmación"
                />
                <Tarjeta titulo="Prevalidadas" valor={prevalidadas} tono="valido" detalle="Resultado interno" />
              </div>
              <dl className="space-y-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">Registros de trabajadores</dt>
                  <dd className="font-mono">{registros}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">Masa salarial declarada</dt>
                  <dd className="font-mono">{formatoBalboas(masa)}</dd>
                </div>
              </dl>
            </Detalles>

            <Detalles titulo="Cambiar el perfil de la sesión" nota="opcional">
              <SelectorSesion />
            </Detalles>

            <Detalles titulo="Avisos legales y origen de los datos">
              <AvisoLegalDemo />
            </Detalles>
          </>
        )}
      </div>
    </Sitio>
  );
}
