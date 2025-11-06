Login E2E Tests
Objetivo
Valida:

Flujo completo de autenticación del usuario

Integración frontend (React) ↔ backend (Laravel)

Validaciones de formulario en tiempo real

Manejo de errores y redirecciones

Persistencia de sesión en localStorage

NO valida:

Seguridad avanzada (OWASP)

Performance bajo carga

Compatibilidad cross-browser

Flujos Probados
Test	            Usuario	    Credenciales	Resultado Esperado
Login exitoso	    PROF001	    Válidas	        Redirección a /mainmenu
Login fallido	    999999	    Inválidas	    Mensaje de error
Validación RPE	    ABC123	    Cualquiera	    Error de formato
Login coordinador	COORD001	Válidas	        Redirección + rol correcto

Cómo Ejecutar
Prerrequisitos:
# Frontend corriendo
npm run dev
# Backend corriendo  
php artisan serve

Ejecutar Tests:
# Todos los tests E2E
npx cypress run --e2e

# Solo tests de login
npx cypress run --e2e --spec "cypress/tests/e2e/auth/login.cy.js"

# Modo interfaz gráfica
npx cypress open

Datos de Prueba
Usuarios Disponibles:
{
  "professor": {
    "rpe": "3045",
    "password": "Cacei#FI@2025",
    "name": "Profesor Test"
  },
  "coordinator": {
    "rpe": "10314",
    "password": "Cacei#FI@2025", 
    "name": "Coordinador Software"
  }
}

Criterios de Éxito
Login Exitoso:
Redirección a /mainmenu

Token almacenado en localStorage

Datos de usuario (RPE, rol) persistidos

No mensajes de error

Login Fallido:
Permanece en página de login

Muestra mensaje de error visible

No redirección

No datos en localStorage

Validaciones:
RPE solo números → error específico

Campos requeridos → validación nativa

Mantenimiento
Responsable:
Equipo frontend + backend

Actualización:
Revisar mensajes de error después de cambios en UI

Actualizar usuarios prueba cuando cambien roles

Verificar endpoints después de cambios en API

Rotación:
Credenciales deben coincidir con base de datos prueba

Tokens regenerados según configuración Sanctum

Reportes y Métricas
Ejecución con Reportes:
# Reporte JSON para CI/CD
npx cypress run --e2e --reporter json

# Reporte HTML
npx cypress run --e2e --reporter mochawesome

# Screenshots en fallos
npx cypress run --e2e --screenshot-on-failure

Evidence Upload Flow - Robust Tests
Objetivo
Valida:

Flujo completo de carga de evidencias con verificación de autenticación

Integración frontend (React) ↔ backend (Laravel) para gestión de evidencias

Navegación entre asignaciones y páginas

Validación de tipos de archivo

Manejo de errores de autenticación y redirecciones

Persistencia de sesión durante operaciones críticas

NO valida:

Seguridad avanzada de upload de archivos

Performance con archivos grandes

Compatibilidad cross-browser

Límites de tamaño de archivo

Flujos Probados
Test	                        Usuario	    Escenario	                                        Resultado Esperado
Upload completo con auth	    PROF001	    Credenciales válidas + asignaciones disponibles	    Carga exitosa de evidencia
Problemas de autenticación	    PROF001	    Token inválido/vencido	                            Redirección a login + recuperación
Validación de archivos	        PROF001	    Archivo PDF (inválido)	                            Mensaje de error de validación
Navegación entre asignaciones	PROF001	    Múltiples asignaciones	                            Cambio correcto entre evidencias

Cómo Ejecutar
Prerrequisitos:
# Frontend corriendo
npm run dev

# Backend corriendo  
php artisan serve

Ejecutar Tests:
# Todos los tests E2E
npx cypress run --e2e

# Solo tests de carga de evidencias
npx cypress run --e2e --spec "cypress/tests/e2e/evidence/upload-evidence.cy.js"

# Modo interfaz gráfica
npx cypress open

Datos de Prueba
Usuarios Disponibles:
{
  "professor": {
    "rpe": "3045",
    "password": "Cacei#FI@2025",
    "name": "Profesor Test"
  }
}

Archivos de Prueba:
Válido: test-file.zip (application/zip)

Inválido: archivo-invalido.pdf (application/pdf)

Criterios de Éxito
Upload Exitoso:
Redirección correcta a /uploadEvidence

Token válido en localStorage

Asignaciones visibles y seleccionables

Formulario de información de evidencia cargado

Justificación completada en editor

Archivo adjuntado correctamente

Operación completada sin errores

Manejo de Auth Fallida:
Redirección a /login cuando token inválido

Re-autenticación exitosa

Restauración de flujo interrumpido

Validaciones de Archivo:
Archivos ZIP permitidos

Archivos PDF rechazados con mensaje de error

UI responde a validaciones del backend

Navegación:
Cambio entre múltiples asignaciones

Información de evidencia se actualiza correctamente

Estado del formulario se mantiene/resetea apropiadamente

Mantenimiento
Responsable:
Equipo frontend + backend

Actualización:
Revisar selectores de UI después de cambios en componentes

Actualizar tipos de archivo permitidos según cambios en validaciones

Verificar endpoints de API después de cambios en rutas Laravel

Mantener usuarios de prueba sincronizados con base de datos de testing

Datos Requeridos:
Usuario profesor con asignaciones activas

Asignaciones en estado "pendiente" o "para carga"

Configuración de tipos de archivo permitidos en backend

Ejecución con Reportes:
# Reporte JSON para CI/CD
npx cypress run --e2e --reporter json

# Reporte HTML detallado
npx cypress run --e2e --reporter mochawesome

# Screenshots automáticos en fallos
npx cypress run --e2e --screenshot-on-failure

# Video de ejecución
npx cypress run --e2e --record --key <record-key>

Métricas Clave:
Tiempo de carga de asignaciones

Tiempo de upload de archivos

Tasa de éxito de autenticación

Detección de regresiones en validaciones

Evidence Review Flow - Robust Tests
Objetivo
Valida:

Flujo completo de revisión y gestión de evidencias

Integración frontend (React) ↔ backend (Laravel) para revisión

Sistema de filtros y ordenamiento de evidencias

Aprobación/rechazo de evidencias con retroalimentación

Visualización de archivos, justificaciones y comentarios

Manejo de roles y permisos de revisión

Estados de evidencia (Pendiente, Aprobada, No Aprobada)

NO valida:

Seguridad avanzada de roles

Performance con grandes volúmenes de datos

Notificaciones en tiempo real

Colaboración simultánea múltiples revisores

Flujos Probados
Test	                          Usuario	    Escenario	                Resultado Esperado
Revisión completa	              COORD001	  Evidencias pendientes	    Aprobación exitosa con comentarios
Rechazo con retroalimentación	  COORD001	  Evidencia con problemas	  Rechazo exitoso con justificación
Filtros y búsqueda	            COORD001	  Múltiples criterios	      Filtrado correcto de evidencias
Visualización detalles	        COORD001	  Evidencia con archivos	  Acceso a archivos y justificación
Estados y comentarios	          COORD001	  Historial de estados	    Visualización de comentarios previos
Evidencias transversales	      COORD001	  Evidencia transversal	    Aprobación/rechazo en lote
Cómo Ejecutar
Prerrequisitos:
# Frontend corriendo
npm run dev

# Backend corriendo  
php artisan serve

# Base de datos de prueba con:
# - Evidencias en estado "PENDIENTE"
# - Usuarios con roles de revisor
# - Archivos de evidencia cargados

# Todos los tests E2E
npx cypress run --e2e

# Solo tests de revisión de evidencias
npx cypress run --e2e --spec "cypress/tests/e2e/review/review-evidence.cy.js"

# Modo interfaz gráfica
npx cypress open

Datos de Prueba
Usuarios Disponibles:
{
  "professor": {
    "rpe": "3045",
    "password": "Cacei#FI@2025",
    "name": "Profesor Test"
  },
  "coordinator": {
    "rpe": "10314",
    "password": "Cacei#FI@2025", 
    "name": "Coordinador Software"
  }
}

Estados de Evidencia:
PENDIENTE: Evidencia esperando revisión

APROBADA: Evidencia aceptada

NO APROBADA: Evidencia rechazada

Criterios de Éxito
Revisión Exitosa:
Carga correcta de lista de evidencias

Filtros aplicables y funcionales

Ordenamiento por columnas

Botones de aprobación/rechazo visibles para evidencias pendientes

Modal de retroalimentación funcional

Confirmación de acción requerida

Actualización de estado en tiempo real

Mensaje de éxito post-operación

Visualización de Detalles:
Modal de archivos descargables

Modal de justificación con formato HTML

Modal de comentarios de estados anteriores

Indicador visual de evidencias transversales

Validaciones:
Retroalimentación no puede estar vacía

Sanitización de input contra XSS

Restricciones de rol respetadas

Evidencias ya revisadas no son editables

es después de cambios en la tabla

Actualizar roles de usuario según cambios en permisos

Verificar endpoints de API para aprobación/rechazo

Mantener datos de prueba con evidencias en estado pendiente

Datos Requeridos:
Evidencias en estado "PENDIENTE" para cada rol

Archivos de evidencia accesibles

Usuarios con roles de revisor (Coordinador, Jefe de Área, Administrador)

Evidencias transversales para pruebas de lote

Métricas Clave:
Tiempo de carga de lista de evidencias

Tiempo de respuesta de aprobación/rechazo

Tasa de éxito de operaciones de revisión

Detección de regresiones en filtros y ordenamiento

E2E Smoke Tests
Objetivo
Qué valida:

Flujos críticos de usuario desde el frontend

Autenticación y manejo de sesión completo

Navegación entre páginas principales

Funcionalidad cross-browser de componentes clave

Persistencia de localStorage y tokens

Comportamiento de logout y protección de rutas

NO valida:

Estilos visuales específicos (solo visibilidad básica)

Funcionalidades avanzadas o edge cases

Performance de carga bajo estrés

Compatibilidad con navegadores obsoletos

Integración con APIs externas reales

Cómo ejecutar
Local
# Ejecutar todos los tests E2E
npx cypress run --e2e --spec "cypress/tests/e2e/smoke/smoke-tests.cy.js"

# Ejecutar en modo interfaz gráfica
npx cypress open --e2e

# Ejecutar tests específicos por título
npx cypress run --e2e --spec "cypress/tests/e2e/smoke/smoke-tests.cy.js" --grep "should login successfully"

# Ejecutar en navegador específico
npx cypress run --e2e --browser chrome

CI/CD
# Ejemplo GitHub Actions
- name: Run E2E Smoke Tests
  run: |
    npx cypress run --e2e --spec "cypress/tests/e2e/smoke/smoke-tests.cy.js"
  
  env:
    CYPRESS_BASE_URL: ${{ secrets.APP_URL }}
    CYPRESS_API_URL: ${{ secrets.API_URL }}

CYPRESS_BASE_URL=  # URL de la aplicación
CYPRESS_API_URL=   # URL del backend

Datos de prueba
Fixtures utilizados
// cypress/fixtures/test-users.json
{
  "professor": {
    "rpe": "3045",
    "password": "Cacei#FI@2025",
    "name": "Profesor Test"
  },
  "coordinator": {
    "rpe": "10314",
    "password": "Cacei#FI@2025", 
    "name": "Coordinador Software"
  }
}

Elementos de UI verificados
Login: inputs RPE/Contraseña, botón "Ingresar"

Main Menu: estructura de navegación básica

Upload Evidence: páginas de carga/subida

Review Evidence: páginas de revisión/tablas

Logout: botones "Cerrar Sesión"/"Logout"/"Salir"

Estados de sesión probados
Autenticación exitosa

Persistencia de token en localStorage

Redirección post-login

Limpieza de sesión en logout

Criterios de salida
Cobertura mínima
100% de tests deben pasar

0% de flakiness tolerado en paths críticos

Performance
Tiempo total de ejecución < 3 minutos

Timeout por test: 10 segundos

Timeout de página: 60 segundos

SLAs de usuario
Login completo < 10 segundos

Navegación entre páginas < 5 segundos

Persistencia de sesión 100% confiable

Códigos de estado aceptables
Redirecciones 3xx: esperadas en flujo auth

Páginas 200: funcionalidad normal

NO se toleran errores 5xx en frontend

Mantenimiento
Rotación de datos
Credenciales: Actualizar en test-users.json si cambian en QA

Selectores UI: Revisar si cambia estructura HTML

Flujos: Actualizar si cambian redirecciones

Responsable
Frontend Team: Mantenimiento de selectores y flujos

QA Team: Ejecución y validación de criterios

DevOps: Configuración CI/CD y entornos

Revisión mensual
Credenciales de prueba siguen siendo válidas

Selectores de UI no han cambiado

Flujos de navegación se mantienen

LocalStorage keys siguen siendo consistentes

Endpoints protegidos mantienen comportamiento

Checklist de actualización
Verificar textos en login ("Ingresar al sistema", "Bienvenido")

Confirmar rutas de redirección post-login

Validar estructura del menú principal

Revisar mecanismos de logout

Actualizar fixtures si hay nuevos roles de usuario