# Frontend

Este es el frontend del proyecto, construido con **React**, **Vite**, **TailwindCSS** y **JavaScript**.

## Requisitos

Asegúrate de tener instalados los siguientes requisitos antes de continuar:


-   [Git](https://git-scm.com/)
-   [Node.js 18+](https://nodejs.org/)
-   [npm](viene junto a Node.js)
-   [Navegador moderno](ej. Chrome)

## Instalación y Configuración

1. Clona el repositorio:  
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd cacei-frontend
   ```
   
2. Instala las dependencias:
    ```bash
    npm install
    ```

3. Crea un archivo .env en la raíz del proyecto y agrega las variables necesarias, como:
    ```env
    VITE_API_URL=http://localhost:8000
    APP_URL=http://localhost
    ```
    VITE_API_URL define la dirección base del backend (Laravel).
    APP_URL indica la dirección del frontend durante el desarrollo

# Desarrollo

Para correr el entorno de desarrollo, usa:

```env
npm run dev
```
Esto iniciará el servidor local de desarrollo Vite en:
`http://localhost:5173/`.

Por defecto, el backend de Laravel se ejecuta en:
http://localhost:8000/

Los puertos son puntos de comunicación entre el sistema operativo y las aplicaciones web.
En este proyecto se utilizan puertos distintos para evitar conflictos y permitir que el frontend y el backend se ejecuten al mismo tiempo sin interferencias.

Servicio: Frontend (Vite)
Puerto: 5173
Propósito: Servir la aplicación React en modo desarrollo
Responsable: Vite (por defecto)

Servicio: Backend (Laravel)
Puerto: 8000
Propósito: Exponer la API REST para las peticiones del frontend
Responsable: Laravel Artisan Serve

Por qué Vite usa el puerto 5173:

Vite utiliza el puerto 5173 por defecto para evitar conflictos con otros servicios comunes (como 3000 o 8080). Este puerto sirve los archivos del frontend (HTML, JS, CSS) y permite la recarga automática (hot reload) durante el desarrollo.

Por qué Laravel usa el puerto 8000:

Laravel inicia su servidor local con el comando php artisan serve, el cual usa el puerto 8000 por defecto.Este puerto aloja la API que el frontend consulta a través de la variable VITE_API_URL.

Comunicación entre ambos:

Cuando el frontend (5173) realiza una petición a http://localhost:8000
, el navegador se comunica con el backend a través del protocolo HTTP, incluso estando en diferentes puertos.

Si alguno de los puertos está en uso o bloqueado, puedes modificarlos.


Para correr el entorno de producción, usa:

```env
npm run build
```

# Pruebas

Para ejecutar pruebas en el proyecto, consulta el [Archivo de Pruebas](./docs/testing/Archivo_de_Pruebas.md) que incluye:

- **Instalaciones requeridas**: Jest, Testing Library, Cypress
- **Unit Tests con Jest**: Pruebas unitarias de componentes y servicios
- **E2E Tests con Cypress**: Pruebas de extremo a extremo de flujos de usuario
- **Configuración y comandos**: Guía paso a paso
- **Flujos de prueba validados**: Login, autenticación y más

Comandos rápidos:
```bash
npm run test              # Ejecutar tests unitarios
npm run test:watch      # Tests en modo watch
npm run cypress:open    # Abrir Cypress interactivo
npm run cypress:run     # Ejecutar tests E2E
```

# Estructura del proyecto

cacei-frontend/
├── .env                          # Variables de entorno
├── .gitignore                    # Archivos ignorados por Git
├── .vscode/                      # Configuración de VS Code
├── package.json                  # Dependencias y scripts
├── package-lock.json             # Lock file de npm
├── eslint.config.js              # Configuración de ESLint
├── vite.config.js                # Configuración de Vite
├── tailwind.config.js            # Configuración de Tailwind CSS
├── cypress.config.js             # Configuración de Cypress
├── index.html                    # Archivo HTML principal
├── README.md                     # Documentación del proyecto
│
├── src/                          # Código fuente principal
│   ├── main.jsx                  # Punto de entrada de React
│   ├── App.jsx                   # Componente principal
│   ├── App.css                   # Estilos de App
│   ├── index.css                 # Estilos globales
│   ├── common.jsx                # Utilidades comunes
│   │
│   ├── components/               # Componentes reutilizables
│   │   ├── AssignTask.jsx
│   │   ├── Card.jsx
│   │   ├── CreateProcessModal.jsx
│   │   ├── CriteriaGuide.jsx
│   │   ├── cv.jsx                # Componente de CV
│   │   ├── DashboardWidgets.jsx
│   │   ├── DeleteProcessModal.jsx
│   │   ├── EditorCacei.jsx
│   │   ├── Feedback.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── logout.jsx
│   │   ├── ModalAlert.jsx
│   │   ├── ModifyProcessModal.jsx
│   │   ├── NotificationCard.jsx
│   │   ├── NotificationTable.jsx
│   │   ├── permissionsTable.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── selectRole.jsx
│   │   ├── UsersCVTable.jsx
│   │   ├── UsersTable.jsx
│   │   └── ReviewEvidence/       # Componentes de revisión de evidencia
│   │
│   ├── pages/                    # Páginas (vistas)
│   │   ├── adminUsers.jsx
│   │   ├── CVsOfProcess.jsx
│   │   ├── Dashboard.jsx
│   │   ├── evidenceManagement.jsx
│   │   ├── EvidencesCompilation.jsx
│   │   ├── framesAdmin.jsx
│   │   ├── frameStructure.jsx
│   │   ├── login.jsx
│   │   ├── MainMenu.jsx
│   │   ├── Notifications.jsx
│   │   ├── PersonalConfig.jsx
│   │   ├── ReviewEvidence.jsx
│   │   └── uploadEvidence.jsx
│   │
│   ├── services/                 # Servicios (API, contexto, etc.)
│   │   ├── api.js                # Configuración de axios
│   │   ├── AuthContext.jsx       # Contexto de autenticación
│   │   └── sessionWatcher.jsx    # Observador de sesión
│   │
│   └── assets/                   # Recursos estáticos
│
├── public/                       # Archivos públicos
│   ├── vite.svg
│   └── build/
│
├── Content/                      # Estilos de Bootstrap
│   ├── bootstrap-*.css
│   └── OwnStyles/
│
├── css/                          # Estilos CSS
│   ├── font-awesome.css
│   └── font-awesome.min.css
│
├── Scripts/                      # Scripts JavaScript
│   ├── bootstrap.*.js
│   └── jquery-*.js
│
├── fonts/                        # Fuentes del proyecto
│   ├── fontawesome-webfont.*
│   ├── OpenSans-*.ttf
│   └── FontAwesome.otf
│
├── Images/                       # Imágenes
│   ├── favicon.png
│   └── logoUASLP.PNG
│
├── app/                          # Carpeta de aplicación (legacy?)
│   └── Http/
│
├── cypress/                      # Tests E2E con Cypress
│
└── docs/                         # Documentación del proyecto