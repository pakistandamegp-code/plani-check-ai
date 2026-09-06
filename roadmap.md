# Roadmap — MVP Caso 7: CSS y Empleadores

> Verificado end-to-end el 2026-09-06: flujo completo carga → validación → hallazgos →
> corrección (nueva versión) → auditoría funciona sin errores de consola.

## Núcleo funcional
- [x] Tipos de dominio (planilla, hallazgo, estados, auditoría)
- [x] Catálogo de reglas, diccionario, matriz normativa, casos de prueba
- [x] Motor de validación (niveles A–F) local
- [x] Datos sintéticos: empleadores, trabajadores, histórico 2026 (B/.)
- [x] CSV: plantilla descargable, parseo, sanitización, límites de tamaño/tipo
- [x] Store con persistencia local + separación por empleador demo
- [x] Landing profesional
- [x] App demo: tablero, carga, listado, detalle de planilla y hallazgos
- [x] Flujo de corrección → nueva versión
- [x] Historial / auditoría (acceso restringido por rol, verificado)
- [x] Reglas, matriz normativa, arquitectura y calidad, equipo
- [x] SEO head() por ruta + responsive
- [x] Explicación de uso integrada dentro de la demo (3 pasos en el tablero + atajo al archivo de ejemplo en Cargar planilla)
- [x] Página /demo/referencia con rangos esperados por herramienta, salario mínimo 2026 y cuotas
- [x] Guía "Instalar las herramientas" (/instalar-herramientas): Python, JMeter, Nikto y Ansible paso a paso

## Seguridad y cumplimiento (solicitud 2)
- [x] Documentar API de Recepción y Gestión (auth demo, solicitud, idempotencia, CSV, empleadores, versiones, auditoría)
- [x] Documentar API de Validación y Resultados (motor de reglas, hallazgos, clasificación, consulta)
- [x] Sección Arquitectura: contratos/endpoints, responsabilidades, flujo seguro, ejemplos de respuesta
- [x] Controles prácticos: sanitización, límites de archivo, errores seguros, IDs no predecibles
- [x] Control de acceso por rol/empresa en UI + bitácora
- [x] Enmascaramiento de identidad en listados
- [x] Matriz de cumplimiento reforzada (Ley 51/2005, Ley 81/2019 + DE 285/2021, Ley 83/2012)
- [x] Disclaimers: MVP académico/demostrativo, sin certificación ni conexión institucional
- [x] Validación contra el salario mínimo real de Panamá 2026 (Decreto Ejecutivo 13 de 2025) y planilla de referencia cargable

## Siguientes pasos posibles
- [ ] Publicar el sitio y compartirlo
- [x] Pulir detalles visuales o contenido según feedback
  - [x] Mejorar estado activo del menú de navegación (indicador más claro y sin fondo verdoso)
- [ ] Pulir más detalles visuales o contenido según feedback
  - [x] Cierre en /tutorial: medidas de seguridad, ataques posibles y defensas
