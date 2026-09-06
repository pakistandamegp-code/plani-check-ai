/**
 * Contratos funcionales de las dos APIs lógicas del producto.
 * En este MVP las operaciones se ejecutan en el navegador; los contratos
 * documentan la separación de responsabilidades definida en el Sprint 1.
 */

export interface Endpoint {
  metodo: string;
  ruta: string;
  proposito: string;
  entrada: string;
  salida: string;
  controles: string[];
  ejemplo: string;
}

export const API_RECEPCION: {
  nombre: string;
  responsabilidad: string;
  endpoints: Endpoint[];
} = {
  nombre: "API de Recepción y Gestión",
  responsabilidad:
    "Autenticación de la sesión demo, identificación del empleador, registro de la solicitud, idempotencia, recepción y validación segura del archivo, gestión de versiones y bitácora de auditoría.",
  endpoints: [
    {
      metodo: "POST",
      ruta: "/api/v1/recepcion/sesion",
      proposito: "Inicia una sesión de demostración y devuelve el rol y el empleador asociado.",
      entrada: "{ usuarioDemoId }",
      salida: "{ sesionId, rol, empleadorId, permisos }",
      controles: [
        "Sin credenciales reales: perfiles ficticios preconfigurados.",
        "El empleador queda fijado por la sesión, no por parámetro del cliente.",
      ],
      ejemplo: `{
  "sesionId": "ses-9f2c…",
  "rol": "Elaborador",
  "empleadorId": "EMP-DEMO-001",
  "permisos": { "cargar": true, "corregir": true, "justificar": false }
}`,
    },
    {
      metodo: "GET",
      ruta: "/api/v1/recepcion/empleadores",
      proposito: "Lista los empleadores visibles según el rol de la sesión.",
      entrada: "—",
      salida: "[{ empleadorId, nombre, actividad, trabajadores }]",
      controles: [
        "Filtrado por empleador de la sesión salvo roles de supervisión.",
        "No expone identificadores de trabajadores.",
      ],
      ejemplo: `[
  { "empleadorId": "EMP-DEMO-001", "nombre": "Distribuidora Istmeña Demo, S.A.", "trabajadores": 6 }
]`,
    },
    {
      metodo: "POST",
      ruta: "/api/v1/recepcion/solicitudes",
      proposito: "Registra una solicitud de prevalidación y recibe el archivo CSV.",
      entrada: "multipart: archivo CSV + { periodo, esquema } + cabecera Idempotency-Key",
      salida: "{ solicitudId, planillaId, version, huella, estado: 'RECIBIDA' }",
      controles: [
        "Límite de tamaño y tipo de archivo; solo CSV UTF-8.",
        "Sanitización de cada celda antes de persistir.",
        "Idempotencia por huella de contenido + período + empleador.",
        "Identificadores no predecibles de 128 bits.",
      ],
      ejemplo: `{
  "solicitudId": "sol-3b71…",
  "planillaId": "pl-77ad…",
  "version": 1,
  "huella": "fp_9c21b0e4…",
  "estado": "RECIBIDA"
}`,
    },
    {
      metodo: "POST",
      ruta: "/api/v1/recepcion/solicitudes/{id}/versiones",
      proposito: "Registra una versión corregida conservando la relación con la anterior.",
      entrada: "{ registrosCorregidos[], motivo }",
      salida: "{ planillaId, version, planillaOrigenId, estado: 'RECIBIDA' }",
      controles: [
        "Nunca sobrescribe la versión anterior.",
        "Requiere permiso de corrección en el rol de la sesión.",
        "Registra actor, fecha, campos modificados y resultado previo.",
      ],
      ejemplo: `{ "planillaId": "pl-a01f…", "version": 2, "planillaOrigenId": "pl-77ad…" }`,
    },
    {
      metodo: "GET",
      ruta: "/api/v1/recepcion/auditoria",
      proposito: "Consulta la bitácora de acciones de la sesión y del empleador.",
      entrada: "?empleadorId&desde&hasta",
      salida: "[{ eventoId, fecha, actor, accion, detalle }]",
      controles: [
        "Solo visible para roles con permiso de auditoría.",
        "Detalle sin datos identificadores de trabajadores.",
      ],
      ejemplo: `[
  { "eventoId": "ev-51c…", "actor": "Elaborador (EMP-DEMO-001)", "accion": "CARGA_CSV" }
]`,
    },
  ],
};

export const API_VALIDACION: {
  nombre: string;
  responsabilidad: string;
  endpoints: Endpoint[];
} = {
  nombre: "API de Validación y Resultados",
  responsabilidad:
    "Ejecuta el motor de reglas por niveles, produce hallazgos explicables, clasifica severidad, calcula el estado de la planilla y expone los resultados y el catálogo de reglas.",
  endpoints: [
    {
      metodo: "POST",
      ruta: "/api/v1/validacion/ejecuciones",
      proposito: "Ejecuta las reglas vigentes sobre una planilla recibida.",
      entrada: "{ planillaId, versionEsquema, incluirHistorico }",
      salida: "{ ejecucionId, estado, resumen: { errores, alertas, validos } }",
      controles: [
        "Solo procesa planillas del empleador de la sesión.",
        "Las reglas sin fuente disponible se declaran limitadas o pendientes.",
      ],
      ejemplo: `{
  "ejecucionId": "eje-c4a2…",
  "estado": "CON_ERRORES",
  "resumen": { "errores": 6, "alertas": 5, "validos": 2 }
}`,
    },
    {
      metodo: "GET",
      ruta: "/api/v1/validacion/planillas/{id}/hallazgos",
      proposito: "Devuelve los hallazgos con su regla, severidad y acción sugerida.",
      entrada: "?severidad&nivel&pagina",
      salida: "[{ fila, campo, codigoRegla, versionRegla, severidad, descripcion, accionSugerida }]",
      controles: [
        "Mensajes sin datos de terceros.",
        "Identidad enmascarada en las vistas de listado.",
      ],
      ejemplo: `{
  "fila": 4,
  "campo": "numero_documento",
  "codigoRegla": "REG-IDE-002",
  "versionRegla": "1.0",
  "severidad": "ERROR",
  "descripcion": "El número de documento no cumple el formato definido para PASAPORTE.",
  "accionSugerida": "Corregir el número según el formato del tipo de documento."
}`,
    },
    {
      metodo: "POST",
      ruta: "/api/v1/validacion/hallazgos/{id}/justificacion",
      proposito: "Registra la confirmación o justificación de una alerta.",
      entrada: "{ justificacion }",
      salida: "{ hallazgoId, severidad, estadoPlanilla }",
      controles: [
        "Solo alertas: un error bloqueante no se justifica, se corrige.",
        "Requiere rol con permiso de justificación.",
        "Texto saneado y de longitud limitada.",
      ],
      ejemplo: `{ "hallazgoId": "hz-2f0…", "estadoPlanilla": "PREVALIDADA" }`,
    },
    {
      metodo: "GET",
      ruta: "/api/v1/validacion/reglas",
      proposito: "Publica el catálogo de reglas vigentes con su fundamento y vigencia.",
      entrada: "?nivel&estado",
      salida: "[{ codigo, version, nivel, condicion, fundamento, resultado, vigenciaDesde }]",
      controles: [
        "Catálogo versionado: una regla modificada conserva la versión anterior.",
        "Sin exposición de configuración sensible ni credenciales.",
      ],
      ejemplo: `{
  "codigo": "REG-SAL-001",
  "version": "1.0",
  "nivel": "E",
  "resultado": "ALERTA",
  "vigenciaDesde": "2026-01-01"
}`,
    },
  ],
};

export const FLUJO_SEGURO = [
  {
    paso: "1. Autenticación de sesión demo",
    api: "Recepción y Gestión",
    control: "El rol y el empleador se fijan del lado del servidor lógico; el cliente no los propone.",
  },
  {
    paso: "2. Recepción del archivo",
    api: "Recepción y Gestión",
    control: "Validación de tipo y tamaño, lectura como texto, sanitización de celdas y huella de integridad.",
  },
  {
    paso: "3. Registro de la solicitud",
    api: "Recepción y Gestión",
    control: "Identificador no predecible e idempotencia por huella + período + empleador.",
  },
  {
    paso: "4. Ejecución de reglas",
    api: "Validación y Resultados",
    control: "Motor por niveles A–F; ninguna regla simula fuentes institucionales no disponibles.",
  },
  {
    paso: "5. Entrega de resultados",
    api: "Validación y Resultados",
    control: "Mensajes de error seguros, identidad enmascarada y clasificación sin atribuir conductas.",
  },
  {
    paso: "6. Corrección y versionado",
    api: "Recepción y Gestión",
    control: "Nueva versión enlazada a la anterior y evento de auditoría por cada acción.",
  },
];

export const CONTROLES_APLICADOS = [
  { control: "Validación y sanitización de CSV", detalle: "Se eliminan caracteres de control, HTML e inyección de fórmulas en cada celda." },
  { control: "Límite de tamaño y tipo", detalle: "Solo archivos .csv de hasta 2 MB y 5 000 filas en la demostración." },
  { control: "Mensajes de error seguros", detalle: "Catálogo de mensajes sin rutas, trazas ni datos de terceros." },
  { control: "Identificadores no predecibles", detalle: "128 bits aleatorios para solicitudes, planillas y hallazgos." },
  { control: "Control de acceso por rol y empresa", detalle: "La interfaz filtra por empleador de la sesión y oculta acciones sin permiso." },
  { control: "Separación de datos por empleador", detalle: "Cada consulta se limita al empleador de la sesión; el intento cruzado se registra." },
  { control: "Bitácora de acciones", detalle: "Carga, validación, corrección, justificación y accesos denegados quedan registrados." },
  { control: "Minimización y enmascaramiento", detalle: "En listados se muestran iniciales y documentos parcialmente ocultos." },
  { control: "Datos ficticios", detalle: "Empresas, trabajadores y documentos sintéticos, no válidos para trámites." },
];
