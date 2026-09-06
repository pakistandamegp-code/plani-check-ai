import { createFileRoute } from "@tanstack/react-router";
import { EncabezadoDemo } from "@/components/demo/comunes";
import { NIVELES, REGLAS } from "@/lib/prevalidacion/reglas";
import {
  CUOTAS_PLANILLA_2026,
  FUENTE_SALARIO_MINIMO,
  JORNADA_REFERENCIA,
  SERVICIO_DOMESTICO_MENSUAL_2026,
  TASAS_SALARIO_MINIMO_2026,
  minimoMensual,
} from "@/lib/prevalidacion/panama-2026";
import { formatoBalboas } from "@/lib/prevalidacion/datos";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/demo/referencia")({
  head: () => ({
    meta: [
      { title: "Rangos esperados y referencia 2026 — Demo de prevalidación" },
      {
        name: "description",
        content:
          "Cada regla de validación con el rango de valores esperados, más las tasas del salario mínimo de Panamá 2026 y las cuotas de planilla, para comparar con la planilla real.",
      },
      { property: "og:title", content: "Rangos esperados y referencia 2026 — Demo de prevalidación" },
      {
        property: "og:description",
        content:
          "Reglas, rangos esperados, salario mínimo Panamá 2026 y cuotas de planilla en una sola pantalla de comparación.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ReferenciaPage,
});

/** Rango o valor esperado que la regla considera aceptable. */
const RANGOS_ESPERADOS: Record<string, string> = {
  "REG-EST-001": "Todas las columnas del esquema CSV v1.0 presentes en el encabezado.",
  "REG-EST-002": "Campos obligatorios con valor: ninguno vacío.",
  "REG-EST-003": "Montos numéricos decimales ≥ 0.00, con punto decimal y sin símbolos.",
  "REG-EST-004": "Cada combinación tipo + número de documento aparece una sola vez.",
  "REG-IDE-001": "tipo_documento ∈ { CEDULA, PASAPORTE, CARNE_RESIDENTE }.",
  "REG-IDE-002": "Cédula: n-nnnn-nnnn. Pasaporte y carné: 6 a 12 caracteres alfanuméricos.",
  "REG-IDE-003": "Número de seguro social de 6 a 14 caracteres alfanuméricos.",
  "REG-IDE-004": "Coincidencia con la fuente institucional (no disponible en la demo).",
  "REG-LAB-001": "dias_trabajados: entero entre 0 y 30.",
  "REG-LAB-002": "Si dias_trabajados > 0, sueldo > B/. 0.00.",
  "REG-CON-001": "Comisiones, bonificaciones u horas extras solo si hay sueldo o días trabajados.",
  "REG-CON-002": "horas_extras ≤ 100% del sueldo del período (umbral configurable).",
  "REG-SAL-001": "viaticos ≤ 25% del sueldo del período.",
  "REG-SAL-002": "gasto_representacion ≤ sueldo ordinario del período.",
  "REG-SAL-003": "Sueldo del período ≥ tasa mínima por hora × 48 h × 52/12, prorrateado por días trabajados.",
  "REG-SAL-005": "Prima de producción en proporción razonable respecto del sueldo (umbral por definir).",
  "REG-HIS-001": "Variación del sueldo respecto del período anterior ≤ 40% (umbral configurable).",
  "REG-HIS-002": "Todo trabajador del período anterior sigue presente en el período actual.",
  "REG-HIS-003": "Trabajadores nuevos respecto del período anterior: confirmados por el empleador.",
};

function tonoResultado(resultado: string) {
  return resultado === "ERROR"
    ? "border-estado-error/40 bg-estado-error/10 text-estado-error"
    : "border-estado-alerta/50 bg-estado-alerta/10 text-estado-alerta";
}

function ReferenciaPage() {
  return (
    <div className="min-h-screen bg-background">
      <EncabezadoDemo
        titulo="Rangos esperados y referencia 2026"
        descripcion="Cada herramienta de validación con el rango de valores que considera aceptable, junto a las tasas oficiales del salario mínimo y las cuotas de planilla. Úsela para comparar los valores de una planilla real antes de cargarla."
      />
      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6">
        {/* 1. Reglas y rangos esperados */}
        <section className="grid gap-6">
          <div>
            <h2 className="text-base font-semibold">Herramientas de validación y rangos esperados</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Cuando el valor de la planilla cae fuera del rango esperado, la regla genera el
              resultado indicado. Los errores bloquean la planilla; las alertas piden confirmación.
            </p>
          </div>
          {NIVELES.map((n) => {
            const reglas = REGLAS.filter((r) => r.nivel === n.nivel);
            if (reglas.length === 0) return null;
            return (
              <div key={n.nivel} className="overflow-hidden rounded-sm border border-border bg-surface">
                <div className="border-b border-border bg-surface-2 px-5 py-4">
                  <h3 className="text-sm font-semibold">
                    Nivel {n.nivel} — {n.titulo}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{n.objetivo}</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[56rem] text-left text-sm">
                    <thead>
                      <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                        <th className="px-5 py-3 font-medium">Herramienta</th>
                        <th className="px-5 py-3 font-medium">Campos</th>
                        <th className="px-5 py-3 font-medium">Rango de valores esperado</th>
                        <th className="px-5 py-3 font-medium">Si se sale del rango</th>
                        <th className="px-5 py-3 font-medium">Fundamento</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reglas.map((r) => (
                        <tr key={r.codigo} className="border-b border-border/60 align-top last:border-0">
                          <td className="px-5 py-3.5">
                            <p className="font-mono text-xs text-teal">{r.codigo}</p>
                            <p className="mt-0.5 text-sm font-medium">{r.nombre}</p>
                            <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                              v{r.version} · {r.estadoRegla}
                            </p>
                          </td>
                          <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">
                            {r.campos.join(", ")}
                          </td>
                          <td className="max-w-[22rem] px-5 py-3.5 text-xs leading-relaxed text-foreground/90">
                            {RANGOS_ESPERADOS[r.codigo] ?? r.condicion}
                          </td>
                          <td className="px-5 py-3.5">
                            <span
                              className={cn(
                                "inline-flex items-center rounded-sm border px-2 py-0.5 font-mono text-[11px] font-medium",
                                tonoResultado(r.resultado),
                              )}
                            >
                              {r.resultado}
                            </span>
                            <p className="mt-1.5 max-w-[14rem] text-[11px] leading-relaxed text-muted-foreground">
                              {r.accion}
                            </p>
                          </td>
                          <td className="max-w-[16rem] px-5 py-3.5 text-[11px] leading-relaxed text-muted-foreground">
                            {r.fundamento}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </section>

        {/* 2. Salario mínimo 2026 */}
        <section className="rounded-sm border border-border bg-surface">
          <div className="border-b border-border bg-surface-2 px-5 py-4">
            <h2 className="text-sm font-semibold">Salario mínimo 2026 por actividad y región</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {FUENTE_SALARIO_MINIMO} Monto mensual estimado con la jornada de referencia de{" "}
              {JORNADA_REFERENCIA.horasSemanales} horas semanales (52/12 semanas por mes).
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[48rem] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Actividad</th>
                  <th className="px-5 py-3 font-medium">Tamaño</th>
                  <th className="px-5 py-3 text-right font-medium">Región 1 (B/./h)</th>
                  <th className="px-5 py-3 text-right font-medium">Región 2 (B/./h)</th>
                  <th className="px-5 py-3 text-right font-medium">Mínimo mensual R1</th>
                  <th className="px-5 py-3 text-right font-medium">Mínimo mensual R2</th>
                </tr>
              </thead>
              <tbody>
                {TASAS_SALARIO_MINIMO_2026.map((t) => (
                  <tr key={t.clave} className="border-b border-border/60 last:border-0">
                    <td className="px-5 py-3 text-sm">{t.actividad}</td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">{t.tamano}</td>
                    <td className="px-5 py-3 text-right font-mono text-sm">{formatoBalboas(t.region1)}</td>
                    <td className="px-5 py-3 text-right font-mono text-sm">{formatoBalboas(t.region2)}</td>
                    <td className="px-5 py-3 text-right font-mono text-sm font-medium">
                      {formatoBalboas(minimoMensual(t.region1))}
                    </td>
                    <td className="px-5 py-3 text-right font-mono text-sm font-medium">
                      {formatoBalboas(minimoMensual(t.region2))}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="px-5 py-3 text-sm">Servicio doméstico (monto mensual fijo)</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">Todas</td>
                  <td className="px-5 py-3 text-right font-mono text-sm" colSpan={2}>
                    — (mensual, no por hora)
                  </td>
                  <td className="px-5 py-3 text-right font-mono text-sm font-medium">
                    {formatoBalboas(SERVICIO_DOMESTICO_MENSUAL_2026.region1)}
                  </td>
                  <td className="px-5 py-3 text-right font-mono text-sm font-medium">
                    {formatoBalboas(SERVICIO_DOMESTICO_MENSUAL_2026.region2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 3. Cuotas de planilla */}
        <section className="rounded-sm border border-border bg-surface">
          <div className="border-b border-border bg-surface-2 px-5 py-4">
            <h2 className="text-sm font-semibold">Cuotas de planilla vigentes (referencia)</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Porcentajes aplicables sobre la base indicada. Úselos para estimar las contribuciones
              de una planilla real.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Concepto</th>
                  <th className="px-5 py-3 font-medium">Trabajador</th>
                  <th className="px-5 py-3 font-medium">Empleador</th>
                  <th className="px-5 py-3 font-medium">Base</th>
                </tr>
              </thead>
              <tbody>
                {CUOTAS_PLANILLA_2026.map((c) => (
                  <tr key={c.concepto} className="border-b border-border/60 last:border-0">
                    <td className="px-5 py-3 text-sm font-medium">{c.concepto}</td>
                    <td className="px-5 py-3 font-mono text-sm">{c.trabajador}</td>
                    <td className="px-5 py-3 font-mono text-sm">{c.empleador}</td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">{c.base}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <p className="rounded-sm border border-gold/40 bg-gold/10 p-4 text-xs leading-relaxed text-foreground/80">
          Uso académico: los rangos y las cifras de esta pantalla son referencia pública para la
          demostración. Antes de aplicarlos a una planilla real confírmelos con la Caja de Seguro
          Social, MITRADEL o un contador autorizado.
        </p>
      </main>
    </div>
  );
}
