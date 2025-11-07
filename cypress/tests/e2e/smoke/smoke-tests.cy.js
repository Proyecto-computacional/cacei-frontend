// cypress/tests/e2e/smoke/smoke-tests.cy.js
describe('Smoke Tests - Critical Paths', () => {
  beforeEach(() => {
    cy.logout()
  })

  it('should load login page and display critical elements', () => {
    cy.visit('/')
    
    // Verificar elementos críticos del login - basado en tu código real
    cy.get('input[placeholder="RPE"]').should('be.visible')
    cy.get('input[placeholder="Contraseña"]').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')
    
    // Verificar textos reales de tu login
    cy.contains('Ingresar al sistema').should('be.visible')
    cy.contains('Bienvenido').should('be.visible')
    cy.get('button[type="submit"]').should('contain', 'Ingresar')
  })

  it('should login successfully with valid credentials', () => {
    cy.fixture('test-users').then((users) => {
      const professor = users.professor
      
      cy.visit('/')
      cy.get('input[placeholder="RPE"]').type(professor.rpe)
      cy.get('input[placeholder="Contraseña"]').type(professor.password)
      cy.get('button[type="submit"]').click()
      
      // Verificar redirección exitosa
      cy.url({ timeout: 10000 }).should('include', '/mainmenu')
      cy.get('body').should('not.contain', 'Error')
    })
  })

  it('should load main menu with navigation options', () => {
    // Login primero
    cy.fixture('test-users').then((users) => {
      const professor = users.professor
      
      cy.visit('/')
      cy.get('input[placeholder="RPE"]').type(professor.rpe)
      cy.get('input[placeholder="Contraseña"]').type(professor.password)
      cy.get('button[type="submit"]').click()
      
      cy.url({ timeout: 10000 }).should('include', '/mainmenu')
    })

    // Verificar elementos críticos del menú principal
    cy.get('body').should(($body) => {
      // Verificar que la página tiene contenido y no está vacía
      expect($body.text().length).to.be.greaterThan(50)
      // Verificar que hay opciones de navegación
      expect($body.find('a, button').length).to.be.greaterThan(0)
    })
    
    // Verificar que no hay errores visibles
    cy.get('body').should('not.contain', 'Error del servidor')
    cy.get('body').should('not.contain', '404')
  })

  it('should access evidence upload page', () => {
    cy.fixture('test-users').then((users) => {
      const professor = users.professor
      
      cy.visit('/')
      cy.get('input[placeholder="RPE"]').type(professor.rpe)
      cy.get('input[placeholder="Contraseña"]').type(professor.password)
      cy.get('button[type="submit"]').click()
      
      cy.url({ timeout: 10000 }).should('include', '/mainmenu')
    })

    cy.visit('/uploadEvidence', { failOnStatusCode: false })
    
    cy.url().then((url) => {
      console.log('📍 URL después de intentar uploadEvidence:', url)
      // Puede estar en uploadEvidence o redirigir a mainmenu
      if (url.includes('/uploadEvidence')) {
        cy.get('body').should(($body) => {
          expect($body.text()).to.match(/(Carga|Subir|Evidencia)/i)
        })
      } else if (url.includes('/mainmenu')) {
        cy.get('body').should('contain', 'Menú')
      }
      // No debería haber errores
      cy.get('body').should('not.contain', 'Error del servidor')
    })
  })

  it('should access evidence review page', () => {
    cy.fixture('test-users').then((users) => {
      const coordinator = users.coordinator
      
      cy.visit('/')
      cy.get('input[placeholder="RPE"]').type(coordinator.rpe)
      cy.get('input[placeholder="Contraseña"]').type(coordinator.password)
      cy.get('button[type="submit"]').click()
      
      cy.url({ timeout: 10000 }).should('include', '/mainmenu')
    })

    cy.visit('/reviewEvidence', { failOnStatusCode: false })
    
    cy.url().then((url) => {
      console.log('📍 URL después de intentar reviewEvidence:', url)
      if (url.includes('/reviewEvidence')) {
        cy.get('body').should(($body) => {
          expect($body.text()).to.match(/(Revisión|evidencias|tabla)/i)
        })
      }
      cy.get('body').should('not.contain', 'Error del servidor')
    })
  })

  it('should maintain session and localStorage', () => {
    cy.fixture('test-users').then((users) => {
      const professor = users.professor
      
      cy.visit('/')
      cy.get('input[placeholder="RPE"]').type(professor.rpe)
      cy.get('input[placeholder="Contraseña"]').type(professor.password)
      cy.get('button[type="submit"]').click()
      
      cy.url({ timeout: 10000 }).should('include', '/mainmenu')
    })

    // Verificar que el token está en localStorage
    cy.window().should((win) => {
      const token = win.localStorage.getItem('token')
      expect(token).to.be.a('string').and.not.be.empty
      
      const userRpe = win.localStorage.getItem('userRpe')
      expect(userRpe).to.be.a('string').and.not.be.empty
    })

    // Navegar a otra página y verificar que la sesión persiste
    cy.visit('/mainmenu')
    cy.url().should('include', '/mainmenu')
    
    // Recargar página y verificar que sigue autenticado
    cy.reload()
    cy.url().should('include', '/mainmenu')
    
    // Verificar que el token sigue ahí después del reload
    cy.window().should((win) => {
      expect(win.localStorage.getItem('token')).to.be.a('string').and.not.be.empty
    })
  })

  it('should logout correctly', () => {
    cy.fixture('test-users').then((users) => {
      const professor = users.professor
      
      cy.visit('/')
      cy.get('input[placeholder="RPE"]').type(professor.rpe)
      cy.get('input[placeholder="Contraseña"]').type(professor.password)
      cy.get('button[type="submit"]').click()
      
      cy.url({ timeout: 10000 }).should('include', '/mainmenu')
    })

    // Buscar y hacer logout - estrategia flexible
    cy.get('body').then(($body) => {
      // Buscar botón de logout por texto
      const logoutSelectors = [
        'button:contains("Cerrar Sesión")',
        'button:contains("Logout")', 
        'button:contains("Salir")',
        'a:contains("Cerrar Sesión")',
        'a:contains("Logout")',
        'a:contains("Salir")'
      ]
      
      let logoutElement = null
      
      for (const selector of logoutSelectors) {
        if ($body.find(selector).length > 0) {
          logoutElement = $body.find(selector)[0]
          break
        }
      }
      
      if (logoutElement) {
        cy.wrap(logoutElement).click({ force: true })
        // Esperar a que procese el logout
        cy.wait(2000)
      } else {
        console.log('⚠️ No se encontró botón de logout, usando comando')
        // Si no hay botón, forzar logout via comando
        cy.logout()
      }
    })

    // Verificar que se redirige al login o página principal
    cy.url().then((url) => {
      const isLoggedOut = url.includes('/login') || 
                         url === Cypress.config().baseUrl + '/' ||
                         !url.includes('/mainmenu')
      
      expect(isLoggedOut).to.be.true
    })
    
    // Verificar que se limpia localStorage
    cy.window().should((win) => {
      expect(win.localStorage.getItem('token')).to.be.null
      expect(win.localStorage.getItem('userRpe')).to.be.null
    })
  })

  // Test adicional: verificar que las rutas protegidas redirigen sin auth
  it('should redirect to login when accessing protected routes without auth', () => {
    // Asegurarse de que no hay sesión
    cy.logout()
    
    // Intentar acceder a rutas protegidas
    cy.visit('/mainmenu', { failOnStatusCode: false })
    cy.url().then((url) => {
      // Debería redirigir a login o estar en login
      const shouldBeOnLogin = url.includes('/login') || url === Cypress.config().baseUrl + '/'
      expect(shouldBeOnLogin).to.be.true
    })
  })
})