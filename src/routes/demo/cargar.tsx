import { useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Download, Upload } from "lucide-react";
import { toast } from "sonner";
import { Sitio } from "@/components/sitio/Sitio";
import { AvisoLegalDemo, Detalles, EncabezadoDemo, SelectorSesion } from "@/components/demo/comunes";
import { PanelSeguridad } from "@/components/demo/PanelSeguridad";
import { ProcesoValidacion } from "@/components/demo/ProcesoValidacion";
import { usePrevalidacion } from "@/lib/prevalidacion/store";
import {
  descargarTexto,
  ENCABEZADOS,
  ESQUEMA_CSV,
  parsearCSV,
  PLANTILLA_CSV,
  registrosACSV,
  validarArchivo,
} from "@/lib/prevalidacion/csv";
import {
  enmascararDocumento,
  enmascararNombre,
  LIMITES_ARCHIVO,
  mensajeErrorSeguro,
} from "@/lib/prevalidacion/seguridad";
import { PLANILLA_FEBRERO_EMP1, PLANILLA_REFERENCIA_2026 } from "@/lib/prevalidacion/datos";
import {
  CUOTAS_PLANILLA_2026,
  FUENTE_SALARIO_MINIMO,
  JORNADA_REFERENCIA,
  referenciaSalarial,
} from "@/lib/prevalidacion/panama-2026";
import type { RegistroPlanilla } from "@/lib/prevalidacion/tipos";

export const Route = createFileRoute("/demo/cargar")({
  head: () => ({
    meta: [
      { title: "Cargar planilla CSV — demo de prevalidación" },
      {
        name: "description",
        content:
          "Carga de archivo CSV de demostración con plantilla descargable, límites de tamaño y sanitización de datos.",
      },
      { property: "og:title", content: "Cargar planilla CSV — demo de prevalidación" },
      { property: "og:description", content: "Plantilla CSV, validación de archivo y procesamiento local de reglas." },
    ],
  }),
  component: Cargar,
});

const PERIODOS = ["2026-01", "2026-02", "2026-03", "2026-04"];

function ParametrosPanama() {
  const { usuario } = usePrevalidacion();
  const ref = usuario.empleadorId ? referenciaSalarial(usuario.empleadorId) : null;
  return (
    <div className="rounded-sm border border-teal/30 bg-surface p-6">
      <h2 className="text-base font-semibold">Datos oficiales con los que se compara</h2>
      {ref ? (
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <dt className="text-muted-foreground">Actividad clasificada</dt>
            <dd className="text-right">
              {ref.actividad} · {ref.tamano}
            </dd>
          </div>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <dt className="text-muted-foreground">Región</dt>
            <dd className="text-right">
              Región {ref.region} · {ref.distritoReferencia}
            </dd>
          </div>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <dt className="text-muted-foreground">Salario mínimo por hora</dt>
            <dd className="font-mono">B/. {ref.tasaHora.toFixed(2)}</dd>
          </div>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <dt className="text-muted-foreground">
              Equivalente mensual ({JORNADA_REFERENCIA.horasSemanales} h/semana)
            </dt>
            <dd className="font-mono">B/. {ref.minimoMensual.toFixed(2)}</dd>
          </div>
        </dl>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">
          Seleccione una sesión con empleador para ver la tasa mínima aplicable.
        </p>
      )}

      <table className="mt-5 w-full text-left text-xs">
        <thead className="text-muted-foreground">
          <tr>
            <th className="py-1 font-medium">Cuota</th>
            <th className="py-1 font-medium">Trabajador</th>
            <th className="py-1 font-medium">Empleador</th>
          </tr>
        </thead>
        <tbody className="font-mono">
          {CUOTAS_PLANILLA_2026.map((c) => (
            <tr key={c.concepto} className="border-t border-border">
              <td className="py-1.5 pr-3 font-sans">{c.concepto}</td>
              <td className="py-1.5 pr-3">{c.trabajador}</td>
              <td className="py-1.5">{c.empleador}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        {FUENTE_SALARIO_MINIMO} Referencia académica: confirme la tasa exacta de su actividad con
        MITRADEL y la CSS antes de usarla en una planilla real.
      </p>
    </div>
  );
}

function Cargar() {
  const { cargarPlanilla, usuario } = usePrevalidacion();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [periodo, setPeriodo] = useState("2026-03");
  const [previa, setPrevia] = useState<{ registros: RegistroPlanilla[]; nombre: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [celdasSaneadas, setCeldasSaneadas] = useState<number | null>(null);
  const [procesando, setProcesando] = useState(false);

  function procesarTexto(texto: string, nombre: string) {
    const res = parsearCSV(texto);
    if (!res.ok) {
      setPrevia(null);
      setCeldasSaneadas(null);
      setError(
        res.columnasFaltantes.length
          ? `${res.error} Faltan columnas: ${res.columnasFaltantes.join(", ")}.`
          : (res.error ?? mensajeErrorSeguro("GENERICO")),
      );
      return;
    }
    setError(null);
    setCeldasSaneadas(res.celdasSaneadas);
    setPrevia({ registros: res.registros, nombre });
  }

  async function alSeleccionar(file: File | undefined) {
    if (!file) return;
    const problema = validarArchivo(file);
    if (problema) {
      setPrevia(null);
      setError(problema);
      return;
    }
    const texto = await file.text();
    procesarTexto(texto, file.name);
  }

  function enviar() {
    if (!previa) return;
    setProcesando(true);
  }

  function finalizarProceso() {
    setProcesando(false);
    if (!previa) return;
    const res = cargarPlanilla({
      registros: previa.registros,
      periodo,
      archivoNombre: previa.nombre,
    });
    if (!res.ok) {
      toast.error(res.mensaje);
      if (res.planillaId) navigate({ to: "/demo/planillas/$planillaId", params: { planillaId: res.planillaId } });
      return;
    }
    toast.success("Solicitud registrada y reglas ejecutadas.");
    setPrevia(null);
    if (inputRef.current) inputRef.current.value = "";
    if (res.planillaId) {
      navigate({ to: "/demo/planillas/$planillaId", params: { planillaId: res.planillaId } });
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }

  const puedeCargar = usuario.permisos.cargar && !!usuario.empleadorId;

  return (
    <Sitio>
      <EncabezadoDemo
        titulo="Cargar planilla"
        descripcion="La recepción valida tipo y tamaño del archivo, sanea cada celda y genera una huella de integridad antes de ejecutar las reglas."
      />
      <ProcesoValidacion
        abierto={procesando}
        registros={previa?.registros.length ?? 0}
        alTerminar={finalizarProceso}
      />
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
        <Detalles titulo="Cambiar el perfil de la sesión y ver avisos legales" nota="opcional">
          <SelectorSesion />
          <AvisoLegalDemo />
        </Detalles>


        {!puedeCargar && (
          <div className="rounded-sm border border-estado-error/40 bg-estado-error/10 p-4 text-sm">
            {mensajeErrorSeguro("ROL_INSUFICIENTE")} Cambie a un perfil de elaborador o representante legal.
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-sm border border-border bg-surface p-6">
              <h2 className="text-base font-semibold">1. Prepare el archivo</h2>
              <p className="mt-2 rounded-sm border border-teal/30 bg-teal/10 p-3 text-sm leading-relaxed text-foreground/80">
                Si solo quiere ver cómo funciona, salte al paso 2 y pulse «Usar el archivo de ejemplo sin
                descargarlo»: trae errores y alertas a propósito para que vea el resultado completo.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Esquema <span className="font-mono">{ESQUEMA_CSV}</span>. Codificación UTF-8, una fila por
                trabajador y montos decimales en balboas.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => descargarTexto("plantilla_planilla_demo.csv", PLANTILLA_CSV)}
                  className="inline-flex items-center gap-2 rounded-sm border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-secondary"
                >
                  <Download className="h-4 w-4" /> Descargar plantilla
                </button>
                <button
                  type="button"
                  onClick={() =>
                    descargarTexto("planilla_ejemplo_con_hallazgos.csv", registrosACSV(PLANILLA_FEBRERO_EMP1))
                  }
                  className="inline-flex items-center gap-2 rounded-sm border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-secondary"
                >
                  <Download className="h-4 w-4" /> Ejemplo con hallazgos
                </button>
              </div>
              <p className="mt-4 font-mono text-xs text-muted-foreground">
                Columnas: {ENCABEZADOS.join(", ")}
              </p>
            </div>

            <div className="rounded-sm border border-border bg-surface p-6">
              <h2 className="text-base font-semibold">2. Registre la solicitud</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="periodo" className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Período de planilla
                  </label>
                  <select
                    id="periodo"
                    value={periodo}
                    onChange={(e) => setPeriodo(e.target.value)}
                    className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2 text-sm"
                  >
                    {PERIODOS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="min-w-0">
                  <label htmlFor="archivo" className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Archivo CSV (máx. {LIMITES_ARCHIVO.tamanoMaximoBytes / (1024 * 1024)} MB)
                  </label>
                  <input
                    ref={inputRef}
                    id="archivo"
                    type="file"
                    accept=".csv,text/csv"
                    disabled={!puedeCargar}
                    onChange={(e) => void alSeleccionar(e.target.files?.[0])}
                    className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2 text-sm file:mr-3 file:rounded-sm file:border-0 file:bg-secondary file:px-3 file:py-1 file:text-xs"
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                <button
                  type="button"
                  onClick={() =>
                    procesarTexto(registrosACSV(PLANILLA_FEBRERO_EMP1), "planilla_ejemplo_con_hallazgos.csv")
                  }
                  className="text-sm font-semibold text-teal hover:underline"
                >
                  Usar el archivo de ejemplo sin descargarlo
                </button>
                <button
                  type="button"
                  onClick={() =>
                    procesarTexto(registrosACSV(PLANILLA_REFERENCIA_2026), "planilla_referencia_panama_2026.csv")
                  }
                  className="text-sm font-semibold text-teal hover:underline"
                >
                  Usar la planilla de referencia Panamá 2026
                </button>
              </div>

              {error && (
                <p className="mt-4 rounded-sm border border-estado-error/40 bg-estado-error/10 p-3 text-sm text-estado-error">
                  {error}
                </p>
              )}
            </div>

            {previa && (
              <div className="rounded-sm border border-border bg-surface p-6">
                <h2 className="text-base font-semibold">3. Confirme el envío</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {previa.registros.length} registros saneados desde{" "}
                  <span className="font-mono">{previa.nombre}</span>
                  {celdasSaneadas ? ` · ${celdasSaneadas} celdas neutralizadas` : ""}. La vista previa
                  muestra la identidad enmascarada: el sistema aplica minimización desde la recepción.
                </p>
                <div className="mt-4 max-h-64 overflow-auto rounded-sm border border-border">
                  <table className="w-full min-w-[36rem] text-xs">
                    <thead className="sticky top-0 bg-surface-2 text-left">
                      <tr className="text-muted-foreground">
                        <th className="px-3 py-2 font-medium">Fila</th>
                        <th className="px-3 py-2 font-medium">Documento</th>
                        <th className="px-3 py-2 font-medium">Trabajador</th>
                        <th className="px-3 py-2 font-medium">Días</th>
                        <th className="px-3 py-2 font-medium">Sueldo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {previa.registros.slice(0, 30).map((r) => (
                        <tr key={r.fila}>
                          <td className="px-3 py-2 font-mono">{r.fila}</td>
                          <td className="px-3 py-2 font-mono">
                            {r.numeroDocumento ? enmascararDocumento(r.numeroDocumento) : "—"}
                          </td>
                          <td className="px-3 py-2 font-mono">
                            {enmascararNombre(r.nombre, r.apellido)}
                          </td>
                          <td className="px-3 py-2 font-mono">{r.diasTrabajados || "—"}</td>
                          <td className="px-3 py-2 font-mono">{r.sueldo || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  type="button"
                  onClick={enviar}
                  disabled={!puedeCargar || procesando}
                  className="mt-5 inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  <Upload className="h-4 w-4" /> Enviar y validar
                </button>
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <Detalles titulo="Qué contiene el archivo de ejemplo" nota="recomendado">
              <p className="text-sm leading-relaxed text-muted-foreground">
                El archivo de ejemplo incluye, de forma deliberada, un documento con formato inválido, un
                registro duplicado, un nombre vacío, días fuera de rango, un monto mal escrito, horas
                extras desproporcionadas, viáticos y gastos de representación elevados y variaciones
                históricas de sueldo. Sirve para observar los seis niveles de validación en un solo envío.
              </p>
            </Detalles>
            <Detalles titulo="Datos oficiales con los que se compara">
              <ParametrosPanama />
            </Detalles>
            <Detalles titulo="Cómo se protege el archivo al recibirlo">
              <PanelSeguridad celdasSaneadas={celdasSaneadas} />
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Cada celda se limpia de caracteres de control, HTML y fórmulas ejecutables.</li>
                <li>• Se calcula una huella de integridad del contenido recibido.</li>
                <li>• Idempotencia: reenviar el mismo contenido y período no duplica el procesamiento.</li>
                <li>• El empleador se toma de su sesión, no del archivo.</li>
                <li>• Los mensajes de error no revelan rutas ni detalles internos.</li>
              </ul>
            </Detalles>
          </aside>
        </div>
      </div>
    </Sitio>
  );
}
