import type { RegistroPlanilla } from "./tipos";

/** Traducción entre el nombre de campo del CSV (snake_case) y la clave del registro. */
export const CAMPOS: Record<string, { clave: keyof RegistroPlanilla; etiqueta: string }> = {
  tipo_documento: { clave: "tipoDocumento", etiqueta: "Tipo de documento" },
  numero_documento: { clave: "numeroDocumento", etiqueta: "N.º de documento" },
  numero_seguro_social: { clave: "numeroSeguroSocial", etiqueta: "N.º de seguro social" },
  nombre: { clave: "nombre", etiqueta: "Nombre" },
  apellido: { clave: "apellido", etiqueta: "Apellido" },
  dias_trabajados: { clave: "diasTrabajados", etiqueta: "Días trabajados" },
  sueldo: { clave: "sueldo", etiqueta: "Sueldo" },
  horas_extras: { clave: "horasExtras", etiqueta: "Horas extras" },
  decimo_tercer_mes: { clave: "decimoTercerMes", etiqueta: "Décimo tercer mes" },
  comisiones: { clave: "comisiones", etiqueta: "Comisiones" },
  bonificaciones: { clave: "bonificaciones", etiqueta: "Bonificaciones" },
  viaticos: { clave: "viaticos", etiqueta: "Viáticos" },
  gasto_representacion: { clave: "gastoRepresentacion", etiqueta: "Gasto de representación" },
  primas_produccion: { clave: "primasProduccion", etiqueta: "Primas de producción" },
};

export function campoInfo(campo: string) {
  return CAMPOS[campo] ?? null;
}

/** Pasos concretos de corrección por regla, en lenguaje del usuario. */
const PASOS: Record<string, string[]> = {
  "REG-EST-001": [
    "Descargue la plantilla CSV v1.0 desde «Cargar planilla».",
    "Copie sus datos dentro de esa plantilla sin renombrar ni reordenar columnas.",
    "Vuelva a enviar el archivo.",
  ],
  "REG-EST-002": [
    "Abra la pestaña «Corrección» y ubique la fila indicada.",
    "Escriba el valor que falta en el campo señalado en rojo.",
    "Indique el motivo y genere la nueva versión.",
  ],
  "REG-EST-003": [
    "Deje solo dígitos y punto decimal: 1250.00, sin B/., comas ni espacios.",
    "Use 0.00 cuando el rubro no aplique (nunca en blanco con valor negativo).",
    "Genere la nueva versión para revalidar.",
  ],
  "REG-EST-004": [
    "Compare las filas con el mismo documento: normalmente es un registro duplicado.",
    "Deje un solo registro por trabajador y período; corrija el documento si en realidad son dos personas.",
    "Genere la nueva versión.",
  ],
  "REG-IDE-001": [
    "Use exactamente uno de estos valores: CEDULA, PASAPORTE o CARNE_RESIDENTE.",
    "Escríbalo en mayúsculas, sin tildes ni espacios.",
    "Genere la nueva versión.",
  ],
  "REG-IDE-002": [
    "Cédula panameña: formato n-nnnn-nnnn (por ejemplo 8-742-1188).",
    "Pasaporte o carné: entre 6 y 12 caracteres alfanuméricos, sin guiones.",
    "Genere la nueva versión.",
  ],
  "REG-IDE-003": [
    "Verifique el número de seguro social en la ficha del trabajador (6 a 14 caracteres).",
    "Corrija el valor en la fila señalada.",
    "Genere la nueva versión.",
  ],
  "REG-LAB-001": [
    "Los días trabajados van de 0 a 30 por período mensual.",
    "Si el trabajador ingresó o salió a mitad de mes, coloque los días efectivos.",
    "Genere la nueva versión.",
  ],
  "REG-LAB-002": [
    "Si el trabajador tiene días trabajados, el sueldo debe ser mayor que 0.00.",
    "Si realmente no laboró, coloque 0 en días trabajados.",
    "Genere la nueva versión.",
  ],
  "REG-SAL-003": [
    "Compare el sueldo con el mínimo mensual de la actividad y región (pestaña «Rangos y referencia»).",
    "Ajuste el sueldo al mínimo proporcional a los días trabajados, o corrija los días si están mal.",
    "Genere la nueva versión: el error bloqueante desaparece al cumplir el mínimo.",
  ],
  "REG-CON-001": [
    "Escriba montos con dos decimales y sin signo negativo.",
    "Revise que el rubro corresponda a la columna correcta.",
    "Genere la nueva versión.",
  ],
  "REG-CON-002": [
    "Las horas extras no deben superar el 100 % del sueldo ordinario.",
    "Verifique el cálculo de recargos y corrija el monto.",
    "Si el monto es correcto, deje constancia del soporte interno antes de enviar a la CSS.",
  ],
  "REG-SAL-001": [
    "Revise si los viáticos superan el 25 % del sueldo: normalmente indica un gasto mal clasificado.",
    "Si el monto es correcto, confirme la alerta escribiendo la justificación en esta misma tarjeta.",
    "Si fue un error, corríjalo en «Corrección» y genere la nueva versión.",
  ],
  "REG-SAL-002": [
    "El gasto de representación no debería superar el sueldo del trabajador.",
    "Confirme la alerta con su justificación si el pago está aprobado internamente.",
    "En caso contrario, corrija el monto y genere la nueva versión.",
  ],
  "REG-SAL-005": [
    "Verifique el cálculo de la prima de producción y su soporte.",
    "Confirme la alerta con la justificación correspondiente.",
  ],
  "REG-HIS-001": [
    "La variación de sueldo frente al período anterior es alta.",
    "Si hubo aumento, ajuste salarial o cambio de jornada, confirme la alerta indicándolo.",
    "Si fue un error de digitación, corrija el sueldo y genere la nueva versión.",
  ],
  "REG-HIS-002": [
    "Faltan trabajadores que sí aparecían en el período anterior.",
    "Si hubo salidas, confirme la alerta indicando el motivo (renuncia, despido, licencia).",
    "Si fue omisión, agregue los registros al CSV y vuelva a cargarlo.",
  ],
  "REG-HIS-003": [
    "Es un trabajador nuevo respecto del período anterior.",
    "Confirme la alerta indicando la fecha de ingreso y su registro en la CSS.",
  ],
};

export function pasosCorreccion(codigoRegla: string, severidad: string): string[] {
  return (
    PASOS[codigoRegla] ?? [
      severidad === "ERROR"
        ? "Corrija el campo señalado en la pestaña «Corrección» y genere la nueva versión."
        : "Revise el valor y, si es correcto, confirme la alerta con su justificación.",
    ]
  );
}
