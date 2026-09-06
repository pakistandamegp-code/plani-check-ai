import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sitio } from "@/components/sitio/Sitio";
import { AvisoLegalDemo, EncabezadoDemo, EtiquetaSeveridad, SelectorSesion } from "@/components/demo/comunes";
import { usePrevalidacion } from "@/lib/prevalidacion/store";
import { campoInfo, pasosCorreccion } from "@/lib/prevalidacion/campos";
import type { Hallazgo, Planilla } from "@/lib/prevalidacion/tipos";

export const Route = createFileRoute("/demo/errores")({
  head: () => ({
    meta: [
      { title: "Errores y cómo arreglarlos — prevalidación de planillas" },
      {
        name: "description",
        content:
          "Bandeja única con todos los errores bloqueantes y alertas de sus planillas, explicados en lenguaje sencillo y con los pasos exactos para corregirlos.",
      },
      { property: "og:title", content: "Errores y cómo arreglarlos" },
      {
        property: "og:description",
        content: "Qué está mal, por qué y qué hacer: pasos de corrección para cada hallazgo de la planilla.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BandejaErrores,
});

type Fila = { planilla: Planilla; hallazgo: Hallazgo };

function BandejaErrores() {
  const { listo, planillasVisibles } = usePrevalidacion();
  const [filtro, setFiltro] = useState<"errores" | "alertas" | "todos">("errores");

  const filas = useMemo<Fila[]>(() => {
    const acumulado: Fila[] = [];
    for (const planilla of planillasVisibles) {
      for (const hallazgo of planilla.hallazgos) {
        if (hallazgo.severidad === "ALERTA" && hallazgo.justificacion) continue;
        acumulado.push({ planilla, hallazgo });
      }
    }
    return acumulado.sort((a, b) =>
      a.hallazgo.severidad === b.hallazgo.severidad
        ? a.hallazgo.codigoRegla.localeCompare(b.hallazgo.codigoRegla)
        : a.hallazgo.severidad === "ERROR"
          ? -1
          : 1,
    );
  }, [planillasVisibles]);

  const errores = filas.filter((f) => f.hallazgo.severidad === "ERROR");
  const alertas = filas.filter((f) => f.hallazgo.severidad === "ALERTA");
  const visibles = filtro === "errores" ? errores : filtro === "alertas" ? alertas : filas;

  return (
    <Sitio>
      <EncabezadoDemo
        titulo="Errores y cómo arreglarlos"
        descripcion="Todo lo que impide enviar sus planillas, reunido en un solo lugar: qué está mal, por qué y qué hacer."
      />
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
        <SelectorSesion />

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-sm border border-estado-error/40 bg-estado-error/10 p-4">
            <p className="font-mono text-2xl font-semibold text-estado-error">{errores.length}</p>
            <p className="mt-1 text-sm font-semibold">Errores bloqueantes</p>
            <p className="mt-1 text-xs leading-relaxed text-foreground/80">
              Hay que cambiar el dato y generar una versión corregida. No se pueden justificar.
            </p>
          </div>
          <div className="rounded-sm border border-estado-alerta/50 bg-estado-alerta/10 p-4">
            <p className="font-mono text-2xl font-semibold text-estado-alerta">{alertas.length}</p>
            <p className="mt-1 text-sm font-semibold">Alertas por revisar</p>
            <p className="mt-1 text-xs leading-relaxed text-foreground/80">
              Pueden estar correctas: si el valor es válido, se confirma con una justificación escrita.
            </p>
          </div>
        </div>

        <AvisoLegalDemo />

        <div className="flex flex-wrap gap-2">
          {(
            [
              { id: "errores", t: `Errores (${errores.length})` },
              { id: "alertas", t: `Alertas (${alertas.length})` },
              { id: "todos", t: `Todo (${filas.length})` },
            ] as const
          ).map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFiltro(f.id)}
              className={`rounded-sm border px-3 py-1.5 text-xs font-semibold transition-colors ${
                filtro === f.id ? "border-teal bg-teal/10 text-teal" : "border-border hover:bg-secondary"
              }`}
            >
              {f.t}
            </button>
          ))}
        </div>

        {!listo && <p className="text-sm text-muted-foreground">Cargando hallazgos…</p>}

        {listo && visibles.length === 0 && (
          <p className="rounded-sm border border-estado-valido/40 bg-estado-valido/10 p-5 text-sm">
            No hay nada pendiente en esta vista. Cargue una planilla en «Cargar planilla» para ver el
            resultado de la validación.
          </p>
        )}

        <ol className="space-y-4">
          {visibles.map(({ planilla, hallazgo: h }, indice) => {
            const info = campoInfo(h.campo);
            const registro = planilla.registros.find((r) => r.fila === h.fila);
            const valor = info && registro ? String(registro[info.clave] ?? "") : "";
            const esError = h.severidad === "ERROR";
            return (
              <li
                key={`${planilla.id}-${h.id}`}
                className={`rounded-sm border border-l-4 border-border bg-surface p-5 ${
                  esError ? "border-l-estado-error" : "border-l-estado-alerta"
                }`}
              >
                <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] text-muted-foreground">
                      {indice + 1} · {planilla.empleadorNombre} · {planilla.periodo} v{planilla.version} ·{" "}
                      {h.fila > 0 ? `fila ${h.fila}` : "planilla completa"} · {h.codigoRegla} (nivel {h.nivel})
                    </p>
                    <p className="mt-2 text-sm font-semibold">{h.descripcion}</p>
                    <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
                      <p className="rounded-sm border border-border bg-surface-2 px-3 py-2">
                        <span className="text-muted-foreground">Dato revisado: </span>
                        <span className="font-medium">{info?.etiqueta ?? h.campo}</span>
                      </p>
                      <p className="rounded-sm border border-border bg-surface-2 px-3 py-2">
                        <span className="text-muted-foreground">Valor recibido: </span>
                        <span className="font-mono font-medium">{valor === "" ? "(vacío)" : valor}</span>
                      </p>
                    </div>
                  </div>
                  <EtiquetaSeveridad severidad={h.severidad} justificada={false} />
                </div>

                <div className="mt-3 rounded-sm border border-teal/30 bg-teal/5 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-teal">
                    {esError ? "Qué hacer para quitar este error" : "Qué hacer con esta alerta"}
                  </p>
                  <ol className="mt-2 space-y-1 text-xs leading-relaxed text-foreground/85">
                    {pasosCorreccion(h.codigoRegla, h.severidad).map((paso, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="font-mono text-teal">{i + 1}.</span>
                        <span>{paso}</span>
                      </li>
                    ))}
                  </ol>
                  <Link
                    to="/demo/planillas/$planillaId"
                    params={{ planillaId: planilla.id }}
                    className="mt-3 inline-block rounded-sm bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Abrir la planilla y corregir →
                  </Link>
                </div>

                <p className="mt-2 text-xs text-muted-foreground">Acción sugerida: {h.accionSugerida}</p>
                <p className="mt-1 text-xs text-muted-foreground">Fundamento: {h.fundamento}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </Sitio>
  );
}
