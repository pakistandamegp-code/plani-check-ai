import { usePrevalidacion } from "@/lib/prevalidacion/store";
import { LIMITES_ARCHIVO } from "@/lib/prevalidacion/seguridad";

interface Props {
  celdasSaneadas?: number | null;
}

/**
 * Panel de evidencia: muestra en vivo los controles de seguridad que la demo
 * está aplicando realmente en este momento (rol, aislamiento, bitácora, límites).
 */
export function PanelSeguridad({ celdasSaneadas = null }: Props) {
  const { usuario, planillas, planillasVisibles, auditoria } = usePrevalidacion();

  const denegados = auditoria.filter((e) => e.accion === "ACCESO_DENEGADO").length;
  const ocultas = Math.max(planillas.length - planillasVisibles.length, 0);
  const permisos = [
    ["Cargar planillas", usuario.permisos.cargar],
    ["Corregir y versionar", usuario.permisos.corregir],
    ["Justificar alertas", usuario.permisos.justificar],
    ["Ver todos los empleadores", usuario.permisos.verTodos],
    ["Ver bitácora de auditoría", usuario.permisos.verAuditoria],
  ] as const;

  return (
    <div className="rounded-sm border border-teal/30 bg-surface p-5 text-sm">
      <p className="font-mono text-[11px] uppercase tracking-wide text-teal">Seguridad activa</p>
      <h2 className="mt-1 text-base font-semibold">Controles que se están aplicando ahora</h2>

      <dl className="mt-4 space-y-2">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <dt className="text-muted-foreground">Rol de la sesión</dt>
          <dd className="text-right font-medium">{usuario.rol}</dd>
        </div>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <dt className="text-muted-foreground">Aislamiento por empleador</dt>
          <dd className="text-right font-mono text-xs">{usuario.empleadorId ?? "Sin empleador asignado"}</dd>
        </div>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <dt className="text-muted-foreground">Planillas visibles / existentes</dt>
          <dd className="font-mono">
            {planillasVisibles.length} / {planillas.length}
          </dd>
        </div>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <dt className="text-muted-foreground">Ocultas por no pertenecerle</dt>
          <dd className="font-mono">{ocultas}</dd>
        </div>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <dt className="text-muted-foreground">Accesos denegados registrados</dt>
          <dd className="font-mono">{denegados}</dd>
        </div>
        {celdasSaneadas !== null && (
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <dt className="text-muted-foreground">Celdas neutralizadas en el último archivo</dt>
            <dd className="font-mono">{celdasSaneadas}</dd>
          </div>
        )}
      </dl>

      <ul className="mt-4 grid gap-1.5">
        {permisos.map(([etiqueta, activo]) => (
          <li key={etiqueta} className="flex items-center justify-between gap-3 text-xs">
            <span className="text-muted-foreground">{etiqueta}</span>
            <span
              className={
                activo
                  ? "rounded-sm border border-estado-valido/40 bg-estado-valido/10 px-2 py-0.5 font-medium text-estado-valido"
                  : "rounded-sm border border-border bg-secondary px-2 py-0.5 font-medium text-muted-foreground"
              }
            >
              {activo ? "Permitido" : "Bloqueado"}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        Límites vigentes en esta carga: .csv de hasta{" "}
        {LIMITES_ARCHIVO.tamanoMaximoBytes / (1024 * 1024)} MB, {LIMITES_ARCHIVO.filasMaximas} filas,{" "}
        {LIMITES_ARCHIVO.columnasMaximas} columnas y {LIMITES_ARCHIVO.longitudMaximaCelda} caracteres por
        celda. Los datos permanecen en este navegador: no se envían a ningún servidor externo.
      </p>
    </div>
  );
}
