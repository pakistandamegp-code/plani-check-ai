import { createFileRoute } from "@tanstack/react-router";
import { Nota, Seccion, Sitio } from "@/components/sitio/Sitio";
import {
  API_RECEPCION,
  API_VALIDACION,
  CONTROLES_APLICADOS,
  FLUJO_SEGURO,
  type Endpoint,
} from "@/lib/prevalidacion/api-contratos";
import { LIMITES_ARCHIVO } from "@/lib/prevalidacion/seguridad";

export const Route = createFileRoute("/arquitectura")({
  head: () => ({
    meta: [
      { title: "Arquitectura, APIs y calidad — prevalidación de planillas" },
      {
        name: "description",
        content:
          "Dos APIs lógicas separadas, contratos y endpoints, flujo seguro, controles aplicados y herramientas previstas de calidad: Python, JMeter, Nikto y Ansible.",
      },
      { property: "og:title", content: "Arquitectura, APIs y calidad" },
      {
        property: "og:description",
        content: "Separación de responsabilidades entre recepción/gestión y validación/resultados.",
      },
    ],
  }),
  component: Arquitectura,
});

const HERRAMIENTAS = [
  {
    nombre: "Python",
    rol: "Lenguaje previsto para el servicio de validación",
    detalle:
      "Motor de reglas, procesamiento del contrato CSV y generación de hallazgos explicables en un despliegue posterior. En esta demostración el motor equivalente se ejecuta en el navegador.",
  },
  {
    nombre: "Apache JMeter",
    rol: "Pruebas de carga y rendimiento",
    detalle:
      "Herramienta prevista para medir tiempos de respuesta y comportamiento con volúmenes altos de registros. No se han ejecutado pruebas en este MVP.",
  },
  {
    nombre: "Nikto",
    rol: "Revisión de superficie web",
    detalle:
      "Herramienta prevista para exploración básica de configuración del servidor en un entorno propio y autorizado. No se ha realizado ninguna prueba de seguridad aquí.",
  },
  {
    nombre: "Ansible",
    rol: "Automatización de despliegue y configuración",
    detalle:
      "Herramienta prevista para provisionar entornos reproducibles y gestionar configuración. La demostración no incluye infraestructura desplegada con Ansible.",
  },
];

function TarjetaEndpoint({ e }: { e: Endpoint }) {
  return (
    <article className="rounded-sm border border-border bg-surface p-5">
      <p className="font-mono text-xs">
        <span className="rounded-sm border border-teal/40 bg-teal/10 px-1.5 py-0.5 text-teal">{e.metodo}</span>{" "}
        <span className="break-all">{e.ruta}</span>
      </p>
      <p className="mt-2 text-sm">{e.proposito}</p>
      <dl className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">Entrada</dt>
          <dd className="mt-0.5 font-mono break-words">{e.entrada}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Salida</dt>
          <dd className="mt-0.5 font-mono break-words">{e.salida}</dd>
        </div>
      </dl>
      <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
        {e.controles.map((c) => (
          <li key={c} className="flex gap-2">
            <span aria-hidden className="text-teal">
              ·
            </span>
            <span>{c}</span>
          </li>
        ))}
      </ul>
      <pre className="mt-3 overflow-x-auto rounded-sm border border-border bg-surface-2 p-3 font-mono text-[11px] leading-relaxed">
        {e.ejemplo}
      </pre>
    </article>
  );
}

function Arquitectura() {
  return (
    <Sitio>
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal">Arquitectura y calidad</p>
          <h1 className="mt-2 text-3xl font-semibold">Dos APIs lógicas separadas</h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            La recepción del archivo y la ejecución de reglas se diseñan como servicios independientes, con
            responsabilidades y contratos distintos. Los ejemplos de respuesta son ilustrativos y no
            contienen claves, credenciales ni datos de personas reales.
          </p>
        </div>
      </div>

      <Seccion eyebrow="Responsabilidades" titulo="Qué resuelve cada servicio">
        <div className="grid gap-4 lg:grid-cols-2">
          {[API_RECEPCION, API_VALIDACION].map((api) => (
            <div key={api.nombre} className="bisel-superior rounded-sm border border-border bg-surface p-6">
              <h2 className="text-lg font-semibold">{api.nombre}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{api.responsabilidad}</p>
              <p className="mt-3 font-mono text-xs text-teal">{api.endpoints.length} endpoints documentados</p>
            </div>
          ))}
        </div>
      </Seccion>

      <div className="border-y border-border bg-surface-2">
        <Seccion eyebrow="Contratos" titulo={API_RECEPCION.nombre}>
          <div className="grid gap-3 lg:grid-cols-2">
            {API_RECEPCION.endpoints.map((e) => (
              <TarjetaEndpoint key={e.ruta + e.metodo} e={e} />
            ))}
          </div>
        </Seccion>
      </div>

      <Seccion eyebrow="Contratos" titulo={API_VALIDACION.nombre}>
        <div className="grid gap-3 lg:grid-cols-2">
          {API_VALIDACION.endpoints.map((e) => (
            <TarjetaEndpoint key={e.ruta + e.metodo} e={e} />
          ))}
        </div>
      </Seccion>

      <div className="border-y border-border bg-surface-2">
        <Seccion
          eyebrow="Flujo seguro"
          titulo="Recorrido de una solicitud, paso a paso"
          descripcion="Cada paso indica qué servicio lo atiende y qué control se aplica antes de continuar."
        >
          <ol className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {FLUJO_SEGURO.map((f) => (
              <li key={f.paso} className="rounded-sm border border-border bg-surface p-5">
                <p className="text-sm font-semibold">{f.paso}</p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-wide text-teal">{f.api}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.control}</p>
              </li>
            ))}
          </ol>
        </Seccion>
      </div>

      <Seccion
        eyebrow="Controles"
        titulo="Medidas aplicadas en la demostración"
        descripcion={`Límites vigentes en la carga: archivos .csv de hasta ${Math.round(LIMITES_ARCHIVO.tamanoMaximoBytes / (1024 * 1024))} MB, ${LIMITES_ARCHIVO.filasMaximas} filas, ${LIMITES_ARCHIVO.columnasMaximas} columnas y ${LIMITES_ARCHIVO.longitudMaximaCelda} caracteres por celda.`}
      >
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {CONTROLES_APLICADOS.map((c) => (
            <div key={c.control} className="rounded-sm border border-border bg-surface p-5">
              <h3 className="text-sm font-semibold">{c.control}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.detalle}</p>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Nota tono="legal">
            Los controles descritos son medidas de diseño de una demostración académica y comercial. No
            constituyen una evaluación de seguridad, una auditoría ni una certificación de cumplimiento.
          </Nota>
        </div>
      </Seccion>

      <div className="border-t border-border bg-surface-2">
        <Seccion
          eyebrow="Protección de la información"
          titulo="Cómo se evita que la información sea robada"
          descripcion="Los incidentes de filtración de datos ocurridos en Panamá en los últimos años muestran que no basta una sola barrera: hacen falta capas. Este diseño aplica defensa en profundidad con tres líneas de protección."
        >
          <div className="grid gap-3 md:grid-cols-3">
            <div className="bisel-superior rounded-sm border border-border bg-surface p-6">
              <p className="font-mono text-[11px] uppercase tracking-wide text-teal">Capa 1 · Antes de entrar</p>
              <h3 className="mt-1 text-sm font-semibold">Reducir lo que se puede robar</h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
                <li>· Solo se aceptan archivos .csv con tamaño, filas y celdas limitados: no hay ejecutables ni scripts.</li>
                <li>· Cada celda se sanitiza contra inyección de fórmulas y HTML, la vía más común de ataque por archivos.</li>
                <li>· Minimización: en listados solo se muestran iniciales y documentos parcialmente ocultos.</li>
              </ul>
            </div>
            <div className="bisel-superior rounded-sm border border-border bg-surface p-6">
              <p className="font-mono text-[11px] uppercase tracking-wide text-teal">Capa 2 · Mientras se usa</p>
              <h3 className="mt-1 text-sm font-semibold">Controlar quién ve qué</h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
                <li>· Acceso por rol: cada usuario solo ejecuta las acciones que su cargo permite.</li>
                <li>· Aislamiento por empleador: una empresa nunca consulta datos de otra; el intento cruzado queda registrado y denegado.</li>
                <li>· Identificadores aleatorios de 128 bits: nadie puede adivinar la dirección del expediente ajeno.</li>
              </ul>
            </div>
            <div className="bisel-superior rounded-sm border border-border bg-surface p-6">
              <p className="font-mono text-[11px] uppercase tracking-wide text-teal">Capa 3 · Después del hecho</p>
              <h3 className="mt-1 text-sm font-semibold">Dejar rastro y limitar el daño</h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
                <li>· Bitácora de acciones: carga, validación, corrección, justificación y accesos denegados quedan auditables.</li>
                <li>· Versionado: las correcciones crean versiones nuevas sin borrar la original; nada se altera sin evidencia.</li>
                <li>· Mensajes de error sin rutas ni trazas: el sistema no filtra su propia estructura interna.</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 grid gap-3 lg:grid-cols-2">
            <div className="rounded-sm border border-border bg-surface p-6">
              <p className="font-mono text-[11px] uppercase tracking-wide text-teal">Respaldo legal</p>
              <h3 className="mt-1 text-sm font-semibold">Leyes que juegan a nuestro favor</h3>
              <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-muted-foreground">
                <li>
                  <span className="font-medium text-foreground">Ley 81 de 2019 (protección de datos personales):</span>{" "}
                  obliga a quien trata datos a garantizar su seguridad y confidencialidad. Diseñar el sistema con
                  minimización, enmascaramiento y aislamiento por empleador no es opcional: es cumplir el principio
                  de seguridad que esta ley exige, y protege tanto al trabajador como al empleador que la use.
                </li>
                <li>
                  <span className="font-medium text-foreground">Decreto Ejecutivo 285 de 2021:</span>{" "}
                  reglamenta la ley anterior y exige medidas técnicas y organizativas documentadas. Nuestra bitácora,
                  el versionado y el control por roles son exactamente el tipo de evidencia que esta norma pide poder
                  demostrar.
                </li>
                <li>
                  <span className="font-medium text-foreground">Ley 51 de 2009 (delitos informáticos):</span>{" "}
                  tipifica como delito el acceso no autorizado a sistemas y la interceptación de datos. Si alguien
                  intentara robar la información, la bitácora de accesos denegados y los registros de actividad son
                  la evidencia que permite perseguirlo penalmente.
                </li>
                <li>
                  <span className="font-medium text-foreground">Ley 83 de 2012 (medios electrónicos):</span>{" "}
                  reconoce la validez de los registros electrónicos, lo que respalda el valor probatorio de nuestra
                  trazabilidad de versiones y acciones.
                </li>
              </ul>
            </div>
            <div className="rounded-sm border border-border bg-surface p-6">
              <p className="font-mono text-[11px] uppercase tracking-wide text-teal">Compromiso en producción</p>
              <h3 className="mt-1 text-sm font-semibold">Lo que haríamos fuertemente para cumplir nuestra parte</h3>
              <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-muted-foreground">
                <li>· Cifrado total: TLS 1.3 en tránsito y AES-256 en reposo, con gestión de claves separada de los datos.</li>
                <li>· Autenticación reforzada: doble factor para cualquier rol con acceso a planillas y sesiones con vencimiento corto.</li>
                <li>· Mínimo privilegio real: cada cuenta y cada servicio solo puede leer lo estrictamente necesario, revisado trimestralmente.</li>
                <li>· Respaldos cifrados y probados: copias diarias con pruebas de restauración, para que ni un ataque ni un fallo borren la información.</li>
                <li>· Monitoreo y plan de respuesta: alertas ante accesos anómalos y un procedimiento de notificación de brechas conforme a la Ley 81.</li>
                <li>· Análisis de impacto y pruebas de penetración autorizadas antes del lanzamiento, repetidas con cada cambio mayor.</li>
              </ul>
            </div>
          </div>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            El aprendizaje de los incidentes públicos de filtración en Panamá es claro: la mayoría proviene de
            accesos excesivos, configuraciones débiles y ausencia de registros, y no de la falta de una sola
            herramienta. Por eso el diseño combina leyes que exigen y protegen, controles técnicos en capas y un
            ciclo de verificación continua con las herramientas del equipo.
          </p>
        </Seccion>
      </div>

      <Seccion
        eyebrow="Metodología"
        titulo="De la demostración a un sistema verificable"
        descripcion="Las cuatro herramientas del equipo no son una lista de productos: forman un ciclo de verificación continua que convierte los controles anteriores en evidencia medible."
      >
        <ol className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              paso: "1 · Aprovisionar",
              herramienta: "Ansible",
              texto:
                "Define servidores y configuraciones como código reproducible. Nadie configura 'a mano': se elimina el error humano que deja puertos abiertos o permisos de más, causa frecuente de filtraciones.",
            },
            {
              paso: "2 · Endurecer",
              herramienta: "Nikto",
              texto:
                "Escanea la superficie web en entornos propios y autorizados para detectar configuraciones inseguras antes de que lo haga un atacante: cabeceras, directorios expuestos y software desactualizado.",
            },
            {
              paso: "3 · Resistir",
              herramienta: "Apache JMeter",
              texto:
                "Simula carga alta para comprobar que el sistema no cae ni degrada sus controles bajo presión, incluidos intentos masivos de acceso o de adivinación de identificadores.",
            },
            {
              paso: "4 · Validar siempre",
              herramienta: "Python",
              texto:
                "El motor de reglas en el servidor revalida todo lo que recibe, sin confiar en la interfaz. Toda decisión queda en la bitácora para auditoría y mejora continua del ciclo.",
            },
          ].map((m) => (
            <li key={m.paso} className="rounded-sm border border-border bg-surface p-5">
              <p className="text-sm font-semibold">{m.paso}</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-wide text-teal">{m.herramienta}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.texto}</p>
            </li>
          ))}
        </ol>
        <div className="mt-6">
          <Nota tono="alerta">
            Este ciclo describe la metodología a la que el equipo puede llegar con las cuatro herramientas. En
            la demostración actual no se ejecutan escaneos ni pruebas de carga, y ninguna prueba futura se
            realizará sobre sistemas de terceros sin autorización expresa.
          </Nota>
        </div>
      </Seccion>

      <div className="border-t border-border bg-surface-2">
        <Seccion
          eyebrow="Calidad"
          titulo="Herramientas previstas y su finalidad"
          descripcion="Compatibilidad documentada del enfoque técnico del equipo. Ninguna de estas herramientas se ejecuta desde esta demostración."
        >
          <div className="grid gap-3 md:grid-cols-2">
            {HERRAMIENTAS.map((h) => (
              <div key={h.nombre} className="rounded-sm border border-border bg-surface p-5">
                <h3 className="text-base font-semibold">{h.nombre}</h3>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-wide text-teal">{h.rol}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{h.detalle}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Nota tono="alerta">
              No se han ejecutado pruebas de carga ni de seguridad sobre sistemas de terceros. Cualquier
              prueba futura debe realizarse solo en entornos propios y con autorización expresa.
            </Nota>
          </div>
        </Seccion>
      </div>
    </Sitio>
  );
}
