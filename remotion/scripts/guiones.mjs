// Guiones fuente (texto narrado). Editar aquí y volver a correr scripts/voz.mjs
export const GUIONES = {
  tutorial: {
    audio: "audio/tutorial.mp3",
    salida: "src/guion-tutorial.ts",
    escenas: [
      {
        id: "intro",
        lineas: [
          "Prevalida Planillas: la plataforma que revisa una planilla antes de presentarla.",
          "Funciona con dos interfaces de programación, y en este video verá las dos, cómo se protegen y cómo se corrige un dato mal puesto.",
        ],
      },
      {
        id: "apis",
        lineas: [
          "La primera es la interfaz de recepción y gestión: abre la sesión, fija el empleador, recibe el archivo, guarda cada versión y anota todo en la bitácora.",
          "La segunda es la interfaz de validación y resultados: ejecuta las reglas de los niveles A a F, entrega los hallazgos explicados y calcula el estado de la planilla.",
          "La primera nunca juzga los datos y la segunda nunca los modifica: cada una tiene una sola responsabilidad.",
        ],
      },
      {
        id: "seguridad",
        lineas: [
          "Las dos interfaces están protegidas con cinco controles.",
          "El empleador lo fija el servidor según la sesión, así nadie puede pedir la planilla de otra empresa.",
          "El archivo se acepta solo como texto separado por comas, con límite de tamaño, y cada celda se limpia de fórmulas y de código antes de guardarse.",
          "Cada envío lleva una llave de idempotencia, los identificadores son de ciento veintiocho bits, y toda acción queda registrada con actor, fecha y resultado.",
        ],
      },
      {
        id: "paso1",
        lineas: [
          "Paso uno: abra la sesión de trabajo.",
          "El sistema devuelve el identificador de la sesión, su rol y el empleador que le corresponde.",
          "Guarde ese identificador. El empleador lo fija el servidor, nunca quien envía la planilla.",
        ],
      },
      {
        id: "paso2",
        lineas: [
          "Paso dos: envíe la planilla en un archivo de valores separados por comas.",
          "El sistema responde con la solicitud, la planilla y la versión uno en estado recibida.",
          "Use la plantilla oficial sin renombrar columnas y conserve el identificador de la planilla.",
        ],
      },
      {
        id: "paso3",
        lineas: [
          "Paso tres: ejecute la validación con las reglas de los niveles A a F.",
          "El resumen muestra seis errores bloqueantes, cinco alertas y dos registros válidos.",
          "Si el estado dice con errores, la planilla todavía no se puede dar por prevalidada.",
        ],
      },
      {
        id: "paso4",
        lineas: [
          "Paso cuatro: lea los hallazgos, uno por uno.",
          "Cada hallazgo indica la fila, el dato revisado, el valor recibido y la regla aplicada.",
          "Un error se corrige. Una alerta se puede confirmar con una justificación escrita.",
        ],
      },
      {
        id: "correccion",
        lineas: [
          "Veamos exactamente qué dato está mal y cómo se arregla.",
          "En la fila cuatro, la columna número de documento dice ocho, guion, setecientos cuarenta y dos, guion, ciento dieciocho, pero el tipo declarado es pasaporte.",
          "Se corrige de una de dos maneras: cambie el tipo a cédula, o escriba el número de pasaporte real, con letras y números y sin guiones.",
          "En la fila dos, los viáticos de cuatrocientos veinte balboas pasan el veinticinco por ciento del sueldo: eso no es un error, es una alerta, y se confirma escribiendo el motivo.",
        ],
      },
      {
        id: "paso5",
        lineas: [
          "Paso cinco: corrija los datos y cree una nueva versión de la planilla.",
          "La versión anterior nunca se sobrescribe, y la nueva queda lista para revalidarse.",
          "Repita el paso tres hasta que la planilla quede prevalidada.",
        ],
      },
      {
        id: "ataques",
        lineas: [
          "Antes de cerrar, veamos de qué nos estamos defendiendo.",
          "Un atacante podría pedir la planilla de otra empresa, subir un archivo con fórmulas escondidas, o repetir el mismo envío para duplicar registros.",
          "También podría intentar adivinar identificadores, alterar una versión ya presentada, o saturar el sistema con cargas enormes.",
        ],
      },
      {
        id: "defensas",
        lineas: [
          "Contra cada intento hay una defensa concreta.",
          "El empleador sale de la sesión del servidor, el archivo se acepta solo como texto separado por comas con límite de tamaño, y cada celda se limpia antes de guardarse.",
          "La llave de idempotencia impide duplicar un envío, los identificadores de ciento veintiocho bits no se pueden adivinar, y ninguna versión se sobrescribe.",
          "Y si algo pasara, la bitácora guarda actor, fecha, acción y resultado, así se puede reconstruir todo lo ocurrido.",
        ],
      },
      {
        id: "cierre",
        lineas: [
          "Corrija, revalide y repita hasta llegar al estado prevalidada.",
          "Dos interfaces, seis niveles de reglas, cinco controles de seguridad y cada error explicado con el paso exacto para arreglarlo.",
          "Sus datos protegidos de punta a punta, en línea con la ley ochenta y uno de dos mil diecinueve.",
        ],
      },
    ],
  },
  movil: {
    audio: "audio/movil.mp3",
    salida: "src/guion-movil.ts",
    escenas: [
      {
        id: "intro",
        lineas: [
          "Prevalida Planillas, desde el teléfono, de principio a fin.",
          "Vamos a recorrer la aplicación tal como se ve en la pantalla, paso por paso.",
        ],
      },
      {
        id: "sesion",
        lineas: [
          "Paso uno: abrir la sesión de trabajo.",
          "La aplicación muestra su rol y el empleador, que lo fija el servidor y no se puede cambiar desde el teléfono.",
        ],
      },
      {
        id: "cargar",
        lineas: [
          "Paso dos: elija el periodo y suba la planilla desde el teléfono.",
          "La demostración usa datos ficticios de trece trabajadores.",
        ],
      },
      {
        id: "validando",
        lineas: [
          "Paso tres: al enviarla, la pantalla muestra el análisis en vivo.",
          "Primero la recepción segura y la limpieza de celdas.",
          "Luego los seis niveles de reglas, uno por uno: estructura del archivo, identidad del trabajador, datos laborales, salarios y viáticos, consistencia interna e historial del empleador.",
          "Al terminar, el evento queda anotado en la bitácora y aparece el resultado.",
        ],
      },
      {
        id: "resultado",
        lineas: [
          "Paso cuatro: el resultado separa lo que bloquea de lo que solo hay que revisar.",
          "Seis errores hay que corregirlos; cinco alertas se confirman con un motivo escrito.",
        ],
      },
      {
        id: "corregir",
        lineas: [
          "Toque un hallazgo y verá la fila, la columna, el valor que llegó y el valor que se espera.",
          "Fila cuatro, número de documento: dice ocho, guion, setecientos cuarenta y dos, guion, ciento dieciocho, y el tipo declarado es pasaporte.",
          "Cámbielo a cédula, o escriba el pasaporte real sin guiones, y guarde la fila.",
        ],
      },
      {
        id: "reenviar",
        lineas: [
          "Paso cinco: envíe la corrección como una versión nueva. La anterior se conserva completa.",
        ],
      },
      {
        id: "listo",
        lineas: [
          "Vuelva a validar y, cuando no quede ningún error, la planilla queda prevalidada.",
        ],
      },
      {
        id: "ataques",
        lineas: [
          "Falta lo más importante: cómo protegemos sus datos.",
          "Alguien podría pedir la planilla de otra empresa, subir un archivo con fórmulas escondidas, repetir un envío para duplicarlo, o intentar adivinar identificadores.",
        ],
      },
      {
        id: "defensas",
        lineas: [
          "Por eso el empleador lo fija el servidor, cada celda se limpia al recibirla, y solo se acepta texto separado por comas con límite de tamaño.",
          "La llave de idempotencia evita duplicados, los identificadores son de ciento veintiocho bits, ninguna versión se sobrescribe y toda acción queda en la bitácora.",
          "Prevalida Planillas: su planilla revisada y sus datos protegidos, desde el teléfono.",
        ],
      },
    ],
  },

};
