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
        id: "cierre",
        lineas: [
          "Corrija, revalide y repita hasta llegar al estado prevalidada.",
          "Dos interfaces, cinco controles de seguridad y cada error explicado con el paso exacto para arreglarlo.",
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
        ],
      },
      {
        id: "apis",
        lineas: [
          "Detrás hay dos interfaces: una recibe y guarda la planilla, la otra la revisa y explica los hallazgos.",
          "Sus datos van protegidos: el empleador lo fija el servidor, el archivo se limpia al recibirlo y toda acción queda registrada.",
        ],
      },
      {
        id: "cargar",
        lineas: [
          "Primero elija la planilla del periodo y súbala desde el teléfono.",
          "La demostración usa datos ficticios de trece trabajadores.",
        ],
      },
      {
        id: "validando",
        lineas: [
          "Al enviarla, el motor revisa estructura, identidad, datos laborales, salarios, consistencia e historial.",
        ],
      },
      {
        id: "resultado",
        lineas: [
          "El resultado separa lo que bloquea de lo que solo hay que revisar.",
          "Seis errores hay que corregirlos; cinco alertas se confirman con un motivo escrito.",
        ],
      },
      {
        id: "corregir",
        lineas: [
          "Cada error le dice la fila, la columna, el valor que llegó y el valor que se espera.",
          "Fila cuatro, número de documento: dice ocho, guion, setecientos cuarenta y dos, guion, ciento dieciocho, y el tipo declarado es pasaporte.",
          "Cámbielo a cédula, o escriba el pasaporte real sin guiones, y guarde la fila.",
        ],
      },
      {
        id: "reenviar",
        lineas: [
          "Envíe la corrección como una versión nueva: la anterior se conserva completa.",
        ],
      },
      {
        id: "listo",
        lineas: [
          "Vuelva a validar y, cuando no quede ningún error, la planilla queda prevalidada.",
        ],
      },
    ],
  },
};
