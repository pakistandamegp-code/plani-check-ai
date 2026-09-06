import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Sitio } from "@/components/sitio/Sitio";
import {
  AvisoLegalDemo,
  EncabezadoDemo,
  EtiquetaEstado,
  EtiquetaSeveridad,
  SelectorSesion,
  Tarjeta,
} from "@/components/demo/comunes";
import { usePrevalidacion } from "@/lib/prevalidacion/store";
import { resumenHallazgos } from "@/lib/prevalidacion/motor";
import { enmascararDocumento, enmascararNombre, mensajeErrorSeguro } from "@/lib/prevalidacion/seguridad";
import { formatoBalboas, totalSueldos } from "@/lib/prevalidacion/datos";
import { campoInfo, pasosCorreccion } from "@/lib/prevalidacion/campos";
import { descargarTexto, registrosACSV } from "@/lib/prevalidacion/csv";
import type { RegistroPlanilla } from "@/lib/prevalidacion/tipos";
import { formatoFecha } from "./auditoria";

export const Route = createFileRoute("/demo/planillas/$planillaId")({
  head: () => ({
    meta: [
      { title: "Detalle de planilla y hallazgos — demo de prevalidación" },
      {
        name: "description",
        content:
          "Hallazgos por regla, registros de la planilla, flujo de corrección versionada y trazabilidad de la solicitud.",
      },
      { property: "og:title", content: "Detalle de planilla y hallazgos" },
      { property: "og:description", content: "Resultados de validación con regla, severidad y acción sugerida." },
    ],
  }),
  component: DetallePlanilla,
});

type Pestana = "hallazgos" | "registros" | "correccion" | "trazabilidad";

const CAMPOS_EDITABLES: { clave: keyof RegistroPlanilla; etiqueta: string }[] = [
  { clave: "tipoDocumento", etiqueta: "Tipo doc." },
  { clave: "numeroDocumento", etiqueta: "N.º documento" },
  { clave: "numeroSeguroSocial", etiqueta: "N.º seguro social" },
  { clave: "nombre", etiqueta: "Nombre" },
  { clave: "apellido", etiqueta: "Apellido" },
  { clave: "diasTrabajados", etiqueta: "Días" },
  { clave: "sueldo", etiqueta: "Sueldo" },
  { clave: "horasExtras", etiqueta: "Horas extras" },
  { clave: "viaticos", etiqueta: "Viáticos" },
  { clave: "gastoRepresentacion", etiqueta: "Gasto repr." },
  { clave: "primasProduccion", etiqueta: "Prima prod." },
];

function DetallePlanilla() {
  const { planillaId } = Route.useParams();
  const navigate = useNavigate();
  const {
    obtenerPlanilla,
    planillas,
    usuario,
    justificarHallazgo,
    crearVersionCorregida,
    ejecutarValidacion,
    registrarEvento,
    listo,
  } = usePrevalidacion();

  const { planilla, denegado } = obtenerPlanilla(planillaId);
  const [pestana, setPestana] = useState<Pestana>("hallazgos");
  const [borrador, setBorrador] = useState<RegistroPlanilla[] | null>(null);
  const [motivo, setMotivo] = useState("");
  const [justificaciones, setJustificaciones] = useState<Record<string, string>>({});
  const [filtro, setFiltro] = useState<"todos" | "errores" | "alertas">("todos");
  const [foco, setFoco] = useState<{ fila: number; clave: string } | null>(null);

  useEffect(() => {
    if (pestana !== "correccion" || !foco) return;
    const el = document.getElementById(`celda-${foco.fila}-${foco.clave}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      (el as HTMLInputElement).focus();
    }
  }, [pestana, foco]);

  useEffect(() => {
    if (listo && denegado) {
      registrarEvento(
        "ACCESO_DENEGADO",
        "Intento de consulta de una solicitud de otro empleador; se bloqueó la respuesta.",
      );
    }
    // Solo debe registrarse una vez por solicitud denegada.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listo, denegado, planillaId]);

  function irACorregir(fila: number, campo: string) {
    const info = campoInfo(campo);
    setFoco(fila > 0 && info ? { fila, clave: String(info.clave) } : null);
    setPestana("correccion");
  }

  const versiones = useMemo(
    () =>
      planilla
        ? planillas
            .filter((p) => p.empleadorId === planilla.empleadorId && p.periodo === planilla.periodo)
            .sort((a, b) => a.version - b.version)
        : [],
    [planilla, planillas],
  );

  if (!listo) {
    return (
      <Sitio>
        <EncabezadoDemo titulo="Detalle de planilla" descripcion="Cargando información de la solicitud." />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <p className="text-sm text-muted-foreground">Cargando…</p>
        </div>
      </Sitio>
    );
  }

  if (denegado || !planilla) {
    return (
      <Sitio>
        <EncabezadoDemo titulo="Detalle de planilla" descripcion="Resultado del control de acceso." />
        <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
          <SelectorSesion />
          <div className="rounded-sm border border-estado-error/40 bg-estado-error/10 p-5 text-sm">
            {denegado ? mensajeErrorSeguro("ACCESO_DENEGADO") : "La solicitud indicada no existe en esta demostración."}
            <p className="mt-2 text-xs text-muted-foreground">
              El intento quedó registrado en la bitácora de auditoría (CP-09).
            </p>
          </div>
          <Link to="/demo/planillas" className="text-sm font-semibold text-teal hover:underline">
            Volver al listado
          </Link>
        </div>
      </Sitio>
    );
  }

  const resumen = resumenHallazgos(planilla.hallazgos);
  const registrosEdit = borrador ?? planilla.registros;

  function actualizarCelda(fila: number, clave: keyof RegistroPlanilla, valor: string) {
    setBorrador((prev) =>
      (prev ?? planilla!.registros).map((r) => (r.fila === fila ? { ...r, [clave]: valor } : r)),
    );
  }

  function generarVersion() {
    if (!borrador) {
      toast.error("Modifique al menos un valor antes de generar una versión.");
      return;
    }
    if (motivo.trim().length < 10) {
      toast.error("Indique un motivo de corrección de al menos 10 caracteres.");
      return;
    }
    const res = crearVersionCorregida(planilla!.id, borrador, motivo);
    if (!res.ok) {
      toast.error(res.mensaje);
      return;
    }
    toast.success(res.mensaje);
    setBorrador(null);
    setMotivo("");
    if (res.planillaId) navigate({ to: "/demo/planillas/$planillaId", params: { planillaId: res.planillaId } });
  }

  const PESTANAS: { id: Pestana; etiqueta: string }[] = [
    { id: "hallazgos", etiqueta: `Hallazgos (${planilla.hallazgos.length})` },
    { id: "registros", etiqueta: `Registros (${planilla.registros.length})` },
    { id: "correccion", etiqueta: "Corrección" },
    { id: "trazabilidad", etiqueta: "Trazabilidad" },
  ];

  return (
    <Sitio>
      <EncabezadoDemo
        titulo="Detalle de planilla"
        descripcion="Resultados de validación con regla, severidad, fundamento y acción sugerida."
      />
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
        <SelectorSesion />

        <div className="bisel-superior rounded-sm border border-border bg-surface p-6">
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold">{planilla.empleadorNombre}</h2>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                Solicitud {planilla.solicitudId} · Período {planilla.periodo} · Versión {planilla.version} ·
                Esquema {planilla.esquema}
              </p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                Recibida {formatoFecha(planilla.recibidaEn)} · Huella {planilla.huella} · Origen{" "}
                {planilla.archivoNombre}
              </p>
            </div>
            <EtiquetaEstado estado={planilla.estado} />
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Tarjeta titulo="Errores bloqueantes" valor={resumen.errores} tono="error" />
            <Tarjeta titulo="Alertas pendientes" valor={resumen.alertas} tono="alerta" />
            <Tarjeta titulo="Alertas confirmadas" valor={resumen.justificadas} tono="valido" />
            <Tarjeta titulo="Masa salarial" valor={formatoBalboas(totalSueldos(planilla.registros))} />
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                ejecutarValidacion(planilla.id);
                toast.success("Reglas reejecutadas sobre esta versión.");
              }}
              className="rounded-sm border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-secondary"
            >
              Reejecutar validación
            </button>
            <button
              type="button"
              onClick={() => descargarTexto(planilla.archivoNombre, registrosACSV(planilla.registros))}
              className="rounded-sm border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-secondary"
            >
              Descargar CSV de esta versión
            </button>
          </div>
        </div>

        <AvisoLegalDemo />

        <nav className="flex gap-1 overflow-x-auto border-b border-border">
          {PESTANAS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPestana(p.id)}
              className={`shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                pestana === p.id ? "border-teal text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {p.etiqueta}
            </button>
          ))}
        </nav>

        {pestana === "hallazgos" && (
          <div className="space-y-3">
            <div className="grid gap-3 rounded-sm border border-border bg-surface-2 p-5 md:grid-cols-2">
              <div className="rounded-sm border border-estado-error/40 bg-estado-error/10 p-4 text-sm">
                <p className="font-semibold text-estado-error">Errores bloqueantes ({resumen.errores})</p>
                <p className="mt-1 text-xs leading-relaxed text-foreground/80">
                  Impiden dar la planilla por prevalidada. Se arreglan cambiando el dato en la pestaña
                  «Corrección» y generando una nueva versión. Use el botón «Corregir este dato» de cada
                  tarjeta: lo lleva directo a la casilla exacta.
                </p>
              </div>
              <div className="rounded-sm border border-estado-alerta/50 bg-estado-alerta/10 p-4 text-sm">
                <p className="font-semibold text-estado-alerta">Alertas por revisar ({resumen.alertas})</p>
                <p className="mt-1 text-xs leading-relaxed text-foreground/80">
                  No bloquean: pueden ser correctas. Si el valor está bien, escriba la justificación en la
                  tarjeta y pulse «Confirmar». Si estaba mal, corríjalo como un error.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {(
                [
                  { id: "todos", t: `Todos (${planilla.hallazgos.length})` },
                  { id: "errores", t: `Solo errores (${resumen.errores})` },
                  { id: "alertas", t: `Solo alertas (${resumen.alertas + resumen.justificadas})` },
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

            {planilla.hallazgos.length === 0 && (
              <p className="rounded-sm border border-estado-valido/40 bg-estado-valido/10 p-5 text-sm">
                Sin hallazgos: la planilla superó los controles configurados (resultado interno).
              </p>
            )}
            {planilla.hallazgos
              .filter((h) =>
                filtro === "todos"
                  ? true
                  : filtro === "errores"
                    ? h.severidad === "ERROR"
                    : h.severidad === "ALERTA",
              )
              .sort((a, b) => (a.severidad === b.severidad ? a.fila - b.fila : a.severidad === "ERROR" ? -1 : 1))
              .map((h) => {
                const info = campoInfo(h.campo);
                const registro = planilla.registros.find((r) => r.fila === h.fila);
                const valorActual =
                  info && registro ? String(registro[info.clave] ?? "") : "";
                const esError = h.severidad === "ERROR";
                return (
              <article
                key={h.id}
                className={`rounded-sm border-l-4 border border-border bg-surface p-5 ${
                  esError ? "border-l-estado-error" : h.justificacion ? "border-l-estado-valido" : "border-l-estado-alerta"
                }`}
              >
                <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-muted-foreground">
                      {h.fila > 0 ? `Fila ${h.fila}` : "Planilla completa"} · {h.codigoRegla} v{h.versionRegla} ·
                      Nivel {h.nivel}
                    </p>
                    <p className="mt-2 text-sm font-medium">{h.descripcion}</p>
                    <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
                      <p className="rounded-sm border border-border bg-surface-2 px-3 py-2">
                        <span className="text-muted-foreground">Campo revisado: </span>
                        <span className="font-medium">{info?.etiqueta ?? h.campo}</span>
                      </p>
                      <p className="rounded-sm border border-border bg-surface-2 px-3 py-2">
                        <span className="text-muted-foreground">Valor recibido: </span>
                        <span className="font-mono font-medium">
                          {valorActual === "" ? "(vacío)" : valorActual}
                        </span>
                      </p>
                    </div>
                    <div className="mt-3 rounded-sm border border-teal/30 bg-teal/5 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-teal">Cómo corregirlo</p>
                      <ol className="mt-2 space-y-1 text-xs leading-relaxed text-foreground/85">
                        {pasosCorreccion(h.codigoRegla, h.severidad).map((paso, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="font-mono text-teal">{i + 1}.</span>
                            <span>{paso}</span>
                          </li>
                        ))}
                      </ol>
                      {h.fila > 0 && info && (
                        <button
                          type="button"
                          onClick={() => irACorregir(h.fila, h.campo)}
                          className="mt-3 rounded-sm bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                          Corregir este dato →
                        </button>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">Acción sugerida: {h.accionSugerida}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Fundamento: {h.fundamento}</p>
                    {h.justificacion && (
                      <p className="mt-2 rounded-sm border border-estado-valido/30 bg-estado-valido/10 p-2 text-xs">
                        Justificación registrada: {h.justificacion}
                      </p>
                    )}
                  </div>
                  <EtiquetaSeveridad severidad={h.severidad} justificada={!!h.justificacion} />
                </div>


                {h.severidad === "ALERTA" && !h.justificacion && (
                  <div className="mt-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                    <div className="min-w-0">
                      <label htmlFor={`just-${h.id}`} className="block text-xs text-muted-foreground">
                        Confirmar o justificar esta alerta
                      </label>
                      <input
                        id={`just-${h.id}`}
                        value={justificaciones[h.id] ?? ""}
                        maxLength={300}
                        onChange={(e) => setJustificaciones((p) => ({ ...p, [h.id]: e.target.value }))}
                        placeholder="Ej.: ajuste salarial aprobado en el período, con soporte interno."
                        className="mt-1 w-full rounded-sm border border-input bg-background px-3 py-2 text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const res = justificarHallazgo(planilla.id, h.id, justificaciones[h.id] ?? "");
                        if (res.ok) toast.success(res.mensaje);
                        else toast.error(res.mensaje);
                      }}
                      className="rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Confirmar
                    </button>
                  </div>
                )}
              </article>
                );
              })}
          </div>
        )}

        {pestana === "registros" && (
          <div className="overflow-x-auto rounded-sm border border-border bg-surface">
            <table className="w-full min-w-[44rem] text-sm">
              <thead className="border-b border-border bg-surface-2 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Fila</th>
                  <th className="px-4 py-3 font-medium">Trabajador</th>
                  <th className="px-4 py-3 font-medium">Documento</th>
                  <th className="px-4 py-3 font-medium">Días</th>
                  <th className="px-4 py-3 font-medium">Sueldo</th>
                  <th className="px-4 py-3 font-medium">Rubros</th>
                  <th className="px-4 py-3 font-medium">Hallazgos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {planilla.registros.map((r) => {
                  const hs = planilla.hallazgos.filter((h) => h.fila === r.fila);
                  return (
                    <tr key={r.fila}>
                      <td className="px-4 py-3 font-mono">{r.fila}</td>
                      <td className="px-4 py-3 font-mono">{enmascararNombre(r.nombre, r.apellido)}</td>
                      <td className="px-4 py-3 font-mono">{enmascararDocumento(r.numeroDocumento)}</td>
                      <td className="px-4 py-3 font-mono">{r.diasTrabajados || "—"}</td>
                      <td className="px-4 py-3 font-mono">{r.sueldo || "—"}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        HE {r.horasExtras} · Viát. {r.viaticos} · G.R. {r.gastoRepresentacion} · Prima{" "}
                        {r.primasProduccion}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">
                        {hs.filter((h) => h.severidad === "ERROR").length}E /{" "}
                        {hs.filter((h) => h.severidad === "ALERTA").length}A
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
              Minimización aplicada: en los listados el nombre se reduce a iniciales y el documento se
              muestra parcialmente enmascarado.
            </p>
          </div>
        )}

        {pestana === "correccion" && (
          <div className="space-y-4">
            {!usuario.permisos.corregir && (
              <p className="rounded-sm border border-estado-error/40 bg-estado-error/10 p-4 text-sm">
                {mensajeErrorSeguro("ROL_INSUFICIENTE")}
              </p>
            )}
            <div className="overflow-x-auto rounded-sm border border-border bg-surface">
              <table className="w-full min-w-[60rem] text-xs">
                <thead className="border-b border-border bg-surface-2 text-left uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 font-medium">Fila</th>
                    {CAMPOS_EDITABLES.map((c) => (
                      <th key={c.clave} className="px-3 py-2 font-medium">
                        {c.etiqueta}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {registrosEdit.map((r) => (
                    <tr key={r.fila}>
                      <td className="px-3 py-2 font-mono">{r.fila}</td>
                      {CAMPOS_EDITABLES.map((c) => {
                        const conError = planilla.hallazgos.some(
                          (h) => h.fila === r.fila && h.campo.replace(/_/g, "") === String(c.clave).toLowerCase(),
                        );
                        return (
                          <td key={c.clave} className="px-2 py-1">
                            <input
                              aria-label={`${c.etiqueta} fila ${r.fila}`}
                              value={String(r[c.clave] ?? "")}
                              maxLength={60}
                              disabled={!usuario.permisos.corregir}
                              onChange={(e) => actualizarCelda(r.fila, c.clave, e.target.value)}
                              className={`w-full min-w-[7rem] rounded-sm border bg-background px-2 py-1 font-mono text-xs ${
                                conError ? "border-estado-error/60" : "border-input"
                              }`}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-3 rounded-sm border border-border bg-surface p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
              <div className="min-w-0">
                <label htmlFor="motivo" className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Motivo de la corrección
                </label>
                <input
                  id="motivo"
                  value={motivo}
                  maxLength={200}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Ej.: corrección de formato de documento y eliminación de registro duplicado."
                  className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <button
                type="button"
                onClick={generarVersion}
                disabled={!usuario.permisos.corregir}
                className="rounded-sm bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                Generar nueva versión
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              La corrección nunca sobrescribe la versión anterior: se crea una versión nueva enlazada con su
              origen, se reejecutan las reglas y se registra el evento en la bitácora.
            </p>
          </div>
        )}

        {pestana === "trazabilidad" && (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-sm border border-border bg-surface">
              <h3 className="border-b border-border px-5 py-3 text-sm font-semibold">Versiones del período</h3>
              <ul className="divide-y divide-border">
                {versiones.map((v) => (
                  <li key={v.id} className="grid gap-1 px-5 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                    <div className="min-w-0">
                      <Link
                        to="/demo/planillas/$planillaId"
                        params={{ planillaId: v.id }}
                        className="text-sm font-medium hover:underline"
                      >
                        Versión {v.version} {v.id === planilla.id && "(actual)"}
                      </Link>
                      <p className="font-mono text-[11px] text-muted-foreground">
                        {formatoFecha(v.recibidaEn)} · {v.usuarioOrigen}
                      </p>
                    </div>
                    <EtiquetaEstado estado={v.estado} />
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-sm border border-border bg-surface">
              <h3 className="border-b border-border px-5 py-3 text-sm font-semibold">Eventos de esta planilla</h3>
              <ul className="divide-y divide-border">
                {planilla.auditoria.map((e) => (
                  <li key={e.id} className="px-5 py-3 text-sm">
                    <span className="font-mono text-xs font-semibold text-teal">{e.accion}</span>
                    <p className="mt-1">{e.detalle}</p>
                    <p className="font-mono text-[11px] text-muted-foreground">
                      {formatoFecha(e.fecha)} · {e.actor}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </Sitio>
  );
}
