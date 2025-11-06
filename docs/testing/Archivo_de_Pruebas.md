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
npx cypress run --e2e --spec "cypress/e2e/auth/login.cy.js"

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
npx cypress run --e2e --spec "cypress/e2e/evidence/upload-evidence.cy.js"

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