const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/tests/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    
    // Excluir carpetas problemáticas
    excludeSpecPattern: [
      '**/Datos de programa/**',
      '**/AppData/**',
      '**/node_modules/**'
    ],
    
    setupNodeEvents(on, config) {
      return config
    },
  },
  
  viewportWidth: 1280,
  viewportHeight: 720,
  
  ignoreTestFiles: [
    '**/Datos de programa/**',
    '**/AppData/**',
    '**/node_modules/**'
  ]
})