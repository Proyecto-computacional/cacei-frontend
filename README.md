# Frontend

Este es el frontend del proyecto, construido con **React**, **Vite**, **TailwindCSS** y **JavaScript**.

## Requisitos

Asegúrate de tener instalados los siguientes requisitos antes de continuar:

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

# Desarrollo

Para correr el entorno de desarrollo, usa:

```env
npm run dev
```

Esto iniciará el servidor de desarrollo en: `http://localhost:5173/`.

Para correr el entorno de producción, usa:

```env
npm run build
```
