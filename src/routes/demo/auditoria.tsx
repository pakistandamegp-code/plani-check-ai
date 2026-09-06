import { createFileRoute } from "@tanstack/react-router";
import { Sitio } from "@/components/sitio/Sitio";
import { AvisoLegalDemo, EncabezadoDemo, SelectorSesion } from "@/components/demo/comunes";
import { usePrevalidacion } from "@/lib/prevalidacion/store";
import { mensajeErrorSeguro } from "@/lib/prevalidacion/seguridad";

export const Route = createFileRoute("/demo/auditoria")({
  head: () => ({
    meta: [
      { title: "Historial y auditoría — demo de prevalidación" },
      {
        name: "description",
        content:
          "Bitácora de cargas, validaciones, correcciones, confirmaciones y accesos denegados de la demostración.",
      },
      { property: "og:title", content: "Historial y auditoría — demo de prevalidación" },
      { property: "og:description", content: "Registro de eventos de la plataforma demostrativa." },
    ],
  }),
  component: Auditoria,
});

export function formatoFecha(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("es-PA", { dateStyle: "medium", timeStyle: "short" });
}

function Auditoria() {
  const { auditoria, usuario, planillasVisibles, reiniciarDemo } = usePrevalidacion();

  if (!usuario.permisos.verAuditoria) {
    return (
      <Sitio>
        <EncabezadoDemo titulo="Historial y auditoría" descripcion="Registro de eventos de la plataforma." />
        <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
          <SelectorSesion />
          <div className="rounded-sm border border-estado-error/40 bg-estado-error/10 p-5 text-sm">
            {mensajeErrorSeguro("ROL_INSUFICIENTE")} La bitácora está disponible para representante legal,
            personal autorizado y auditoría.
          </div>
        </div>
      </Sitio>
    );
  }

  return (
    <Sitio>
      <EncabezadoDemo
        titulo="Historial y auditoría"
        descripcion="Cada acción relevante queda registrada con actor, fecha y detalle, sin exponer datos identificadores de trabajadores."
      />
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
        <SelectorSesion />
        <AvisoLegalDemo />

        <div className="rounded-sm border border-border bg-surface">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
            <h2 className="text-base font-semibold">Bitácora de acciones</h2>
            <button
              type="button"
              onClick={reiniciarDemo}
              className="rounded-sm border border-border px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-secondary"
            >
              Reiniciar datos de demostración
            </button>
          </div>
          <ul className="divide-y divide-border">
            {auditoria.slice(0, 60).map((e) => (
              <li key={e.id} className="grid gap-1 px-6 py-3 sm:grid-cols-[10rem_9rem_minmax(0,1fr)] sm:items-baseline">
                <span className="font-mono text-xs text-muted-foreground">{formatoFecha(e.fecha)}</span>
                <span className="font-mono text-xs font-semibold text-teal">{e.accion}</span>
                <span className="min-w-0 text-sm">
                  <span className="block text-foreground">{e.detalle}</span>
                  <span className="block truncate text-xs text-muted-foreground">{e.actor}</span>
                </span>
              </li>
            ))}
            {auditoria.length === 0 && (
              <li className="px-6 py-6 text-sm text-muted-foreground">Aún no hay eventos registrados.</li>
            )}
          </ul>
        </div>

        <div className="rounded-sm border border-border bg-surface">
          <h2 className="border-b border-border px-6 py-4 text-base font-semibold">Versiones por planilla</h2>
          <ul className="divide-y divide-border">
            {planillasVisibles.map((p) => (
              <li key={p.id} className="px-6 py-3 text-sm">
                <span className="font-medium">{p.empleadorNombre}</span>
                <span className="ml-2 font-mono text-xs text-muted-foreground">
                  {p.periodo} · v{p.version} · huella {p.huella.slice(0, 14)}…
                  {p.planillaOrigenId ? " · corrige versión anterior" : " · versión original"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Sitio>
  );
}
