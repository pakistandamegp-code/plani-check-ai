import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sitio } from "@/components/sitio/Sitio";
import { AvisoLegalDemo, EncabezadoDemo, EtiquetaEstado, SelectorSesion } from "@/components/demo/comunes";
import { usePrevalidacion } from "@/lib/prevalidacion/store";
import { resumenHallazgos } from "@/lib/prevalidacion/motor";
import type { EstadoPlanilla } from "@/lib/prevalidacion/tipos";

export const Route = createFileRoute("/demo/planillas/")({
  head: () => ({
    meta: [
      { title: "Planillas recibidas — demo de prevalidación" },
      {
        name: "description",
        content: "Listado de planillas de demostración con su período, versión, estado y hallazgos.",
      },
      { property: "og:title", content: "Planillas recibidas — demo de prevalidación" },
      { property: "og:description", content: "Listado de planillas sintéticas y su estado de prevalidación." },
    ],
  }),
  component: ListaPlanillas,
});

const ESTADOS: (EstadoPlanilla | "TODOS")[] = [
  "TODOS",
  "RECIBIDA",
  "CON_ERRORES",
  "EN_REVISION",
  "PREVALIDADA",
];

function ListaPlanillas() {
  const { planillasVisibles, listo } = usePrevalidacion();
  const [filtro, setFiltro] = useState<EstadoPlanilla | "TODOS">("TODOS");

  const lista = planillasVisibles
    .filter((p) => filtro === "TODOS" || p.estado === filtro)
    .sort((a, b) => (a.recibidaEn < b.recibidaEn ? 1 : -1));

  return (
    <Sitio>
      <EncabezadoDemo
        titulo="Planillas recibidas"
        descripcion="Cada solicitud conserva su período, versión, huella de integridad y resultado de validación."
      />
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
        <SelectorSesion />
        <AvisoLegalDemo />

        <div className="flex flex-wrap gap-2">
          {ESTADOS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setFiltro(e)}
              className={`rounded-sm border px-3 py-1.5 font-mono text-xs transition-colors ${
                filtro === e
                  ? "border-teal bg-teal/10 text-teal"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {e.replace("_", " ")}
            </button>
          ))}
        </div>

        {!listo ? (
          <p className="text-sm text-muted-foreground">Cargando…</p>
        ) : lista.length === 0 ? (
          <p className="rounded-sm border border-border bg-surface p-6 text-sm text-muted-foreground">
            No hay planillas para este filtro en su sesión.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-sm border border-border bg-surface">
            <table className="w-full min-w-[46rem] text-sm">
              <thead className="border-b border-border bg-surface-2 text-left">
                <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Empleador</th>
                  <th className="px-4 py-3 font-medium">Período</th>
                  <th className="px-4 py-3 font-medium">Versión</th>
                  <th className="px-4 py-3 font-medium">Registros</th>
                  <th className="px-4 py-3 font-medium">Errores</th>
                  <th className="px-4 py-3 font-medium">Alertas</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3 font-medium sr-only">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {lista.map((p) => {
                  const r = resumenHallazgos(p.hallazgos);
                  return (
                    <tr key={p.id} className="hover:bg-surface-2">
                      <td className="px-4 py-3">
                        <span className="block max-w-[18rem] truncate font-medium">{p.empleadorNombre}</span>
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {p.solicitudId.slice(0, 12)}…
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono">{p.periodo}</td>
                      <td className="px-4 py-3 font-mono">v{p.version}</td>
                      <td className="px-4 py-3 font-mono">{p.registros.length}</td>
                      <td className="px-4 py-3 font-mono text-estado-error">{r.errores}</td>
                      <td className="px-4 py-3 font-mono text-estado-alerta">{r.alertas}</td>
                      <td className="px-4 py-3">
                        <EtiquetaEstado estado={p.estado} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          to="/demo/planillas/$planillaId"
                          params={{ planillaId: p.id }}
                          className="font-semibold text-teal hover:underline"
                        >
                          Detalle
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Sitio>
  );
}
