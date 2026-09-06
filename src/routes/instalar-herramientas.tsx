import { createFileRoute } from "@tanstack/react-router";
import { Nota, Seccion, Sitio } from "@/components/sitio/Sitio";

export const Route = createFileRoute("/instalar-herramientas")({
  head: () => ({
    meta: [
      { title: "Instalar las herramientas: Python, JMeter, Nikto y Ansible" },
      {
        name: "description",
        content:
          "Guía paso a paso para instalar Python, Apache JMeter, Nikto y Ansible en Windows, macOS y Linux, con comandos de verificación.",
      },
      { property: "og:title", content: "Instalar las herramientas — Python, JMeter, Nikto y Ansible" },
      {
        property: "og:description",
        content: "Instrucciones paso a paso y comandos de verificación para cada herramienta del proyecto.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: InstalarHerramientas,
});

interface Paso {
  titulo: string;
  comandos?: string[];
  texto?: string;
}

interface Herramienta {
  nombre: string;
  paraQue: string;
  requisito?: string;
  pasos: Paso[];
  verificacion: { comando: string; esperado: string };
}

const HERRAMIENTAS: Herramienta[] = [
  {
    nombre: "Python 3",
    paraQue: "Motor de reglas y procesamiento del contrato CSV en el servicio de validación.",
    pasos: [
      {
        titulo: "Windows — instalador oficial",
        texto:
          "Descargue el instalador de python.org/downloads y, al ejecutarlo, marque la casilla «Add python.exe to PATH» antes de pulsar Install. Sin esa casilla el comando python no quedará disponible en la terminal.",
      },
      {
        titulo: "macOS — con Homebrew",
        comandos: ["brew install python@3"],
        texto: "Si no tiene Homebrew, instálelo primero desde brew.sh con el comando que ahí se indica.",
      },
      {
        titulo: "Linux (Debian/Ubuntu)",
        comandos: ["sudo apt update", "sudo apt install python3 python3-pip python3-venv"],
      },
      {
        titulo: "Crear un entorno virtual (recomendado en cualquier sistema)",
        comandos: ["python3 -m venv .venv", "source .venv/bin/activate  # en Windows: .venv\\Scripts\\activate"],
        texto: "El entorno virtual aísla las dependencias del proyecto del resto del sistema.",
      },
    ],
    verificacion: {
      comando: "python3 --version && python3 -m pip --version",
      esperado: "Python 3.x.x y la versión de pip sin errores.",
    },
  },
  {
    nombre: "Apache JMeter",
    paraQue: "Pruebas de carga y rendimiento de las APIs de recepción y validación.",
    requisito: "Requiere Java 17 o superior. Compruébelo con: java -version",
    pasos: [
      {
        titulo: "Instalar Java si no lo tiene",
        comandos: [
          "# Windows/macOS: instale un JDK desde adoptium.net (Temurin 17+)",
          "# Linux (Debian/Ubuntu):",
          "sudo apt install openjdk-17-jre-headless",
        ],
      },
      {
        titulo: "Descargar JMeter",
        texto:
          "Descargue el archivo .tgz o .zip de jmeter.apache.org (sección Download Releases, «Binaries») y descomprímalo en una carpeta fija, por ejemplo C:\\jmeter o ~/jmeter.",
      },
      {
        titulo: "Ejecutar JMeter",
        comandos: [
          "# Windows:",
          "C:\\jmeter\\bin\\jmeter.bat",
          "# macOS/Linux:",
          "~/jmeter/bin/jmeter",
        ],
        texto: "La primera ejecución abre la interfaz gráfica; es normal que tarde unos segundos.",
      },
      {
        titulo: "Alternativa con gestor de paquetes",
        comandos: ["brew install jmeter  # macOS", "choco install jmeter  # Windows con Chocolatey"],
      },
    ],
    verificacion: {
      comando: "jmeter --version",
      esperado: "Muestra la versión de Apache JMeter y la de Java detectada.",
    },
  },
  {
    nombre: "Nikto",
    paraQue:
      "Revisión de la superficie web (configuración del servidor) en un entorno propio y autorizado.",
    pasos: [
      {
        titulo: "Linux (Debian/Ubuntu) — vía apt",
        comandos: ["sudo apt update", "sudo apt install nikto"],
      },
      {
        titulo: "macOS — con Homebrew",
        comandos: ["brew install nikto"],
      },
      {
        titulo: "Windows — mediante WSL",
        texto:
          "Nikto no tiene instalador nativo de Windows. Instale WSL (subsistema de Linux) con el comando «wsl --install» en PowerShell como administrador, reinicie, abra la terminal de Ubuntu que se crea y siga los pasos de Linux.",
      },
      {
        titulo: "Alternativa universal — contenedor Docker",
        comandos: ["docker run --rm sullo/nikto -h https://su-sitio-interno"],
        texto: "Funciona igual en Windows, macOS y Linux si ya tiene Docker instalado.",
      },
    ],
    verificacion: {
      comando: "nikto -Version",
      esperado: "Muestra la versión de Nikto sin errores de Perl.",
    },
  },
  {
    nombre: "Ansible",
    paraQue: "Automatización de despliegue y configuración de entornos reproducibles.",
    requisito: "Ansible se instala con pip, así que necesita Python 3 (primera guía de esta página).",
    pasos: [
      {
        titulo: "Linux (Debian/Ubuntu) — paquete del sistema",
        comandos: ["sudo apt update", "sudo apt install ansible"],
      },
      {
        titulo: "Cualquier sistema — con pip dentro del entorno virtual",
        comandos: ["python3 -m pip install --user ansible"],
        texto: "Con el entorno virtual activado, use simplemente: pip install ansible",
      },
      {
        titulo: "macOS — con Homebrew",
        comandos: ["brew install ansible"],
      },
      {
        titulo: "Windows — mediante WSL",
        texto:
          "Ansible no corre de forma nativa en Windows. Use WSL (wsl --install en PowerShell como administrador) e instálelo dentro de la terminal de Ubuntu con cualquiera de los métodos anteriores.",
      },
      {
        titulo: "Primera prueba real",
        comandos: ["ansible localhost -m ping"],
        texto: "Debe responder «pong». Así confirma que Ansible ejecuta tareas contra la máquina local.",
      },
    ],
    verificacion: {
      comando: "ansible --version",
      esperado: "Muestra la versión de ansible-core y la ruta de configuración.",
    },
  },
];

function BloqueComandos({ comandos }: { comandos: string[] }) {
  return (
    <pre className="mt-2 overflow-x-auto rounded-sm border border-border bg-ink p-3 font-mono text-xs leading-relaxed text-ink-foreground">
      {comandos.join("\n")}
    </pre>
  );
}

function InstalarHerramientas() {
  return (
    <Sitio>
      <Seccion
        eyebrow="Guía práctica"
        titulo="Instalar las herramientas"
        descripcion="Python, JMeter, Nikto y Ansible paso a paso, en Windows, macOS y Linux. Al final de cada herramienta hay un comando de verificación: si responde lo esperado, la instalación quedó lista."
      >
        <Nota tono="info">
          Siga las guías en el orden en que aparecen: JMeter y Ansible dependen de pasos anteriores
          (Java y Python respectivamente). En Windows, Nikto y Ansible se instalan dentro de WSL, el
          subsistema de Linux incluido en el sistema.
        </Nota>

        <div className="mt-10 grid gap-8">
          {HERRAMIENTAS.map((h, indice) => (
            <article key={h.nombre} className="overflow-hidden rounded-sm border border-border bg-surface">
              <header className="border-b border-border bg-surface-2 px-6 py-5">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal">
                  Herramienta {indice + 1} de {HERRAMIENTAS.length}
                </p>
                <h3 className="mt-1 text-xl font-semibold">{h.nombre}</h3>
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{h.paraQue}</p>
                {h.requisito && (
                  <p className="mt-3 rounded-sm border border-estado-alerta/40 bg-estado-alerta/10 px-3 py-2 text-xs text-foreground">
                    <strong className="font-semibold">Requisito previo:</strong> {h.requisito}
                  </p>
                )}
              </header>
              <ol className="grid gap-5 px-6 py-6">
                {h.pasos.map((p, i) => (
                  <li key={p.titulo} className="grid gap-2 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-4">
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-teal/15 font-mono text-xs font-semibold text-teal">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold">{p.titulo}</h4>
                      {p.comandos && <BloqueComandos comandos={p.comandos} />}
                      {p.texto && (
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.texto}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
              <footer className="border-t border-border bg-surface-2 px-6 py-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Verificación
                </p>
                <BloqueComandos comandos={[h.verificacion.comando]} />
                <p className="mt-2 text-xs text-muted-foreground">
                  Resultado esperado: {h.verificacion.esperado}
                </p>
              </footer>
            </article>
          ))}
        </div>

        <div className="mt-10">
          <Nota tono="legal">
            Nikto solo debe ejecutarse contra servidores propios o con autorización escrita. Ninguna
            de estas herramientas se usó contra sistemas de la Caja de Seguro Social; en esta
            demostración el motor de reglas equivalente corre en el navegador.
          </Nota>
        </div>
      </Seccion>
    </Sitio>
  );
}
