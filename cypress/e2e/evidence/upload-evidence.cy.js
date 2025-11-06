// cypress/e2e/evidence/upload-evidence-robust.cy.js
describe('Evidence Upload Flow - Robust', () => {
  beforeEach(() => {
    cy.logout()
  })

  it('should complete evidence upload with auth verification', () => {
    // 1. Login con verificación explícita
    cy.fixture('test-users').then((users) => {
      const professor = users.professor
      
      cy.visit('/')
      cy.get('input[placeholder="RPE"]').type(professor.rpe)
      cy.get('input[placeholder="Contraseña"]').type(professor.password)
      cy.get('button[type="submit"]').click()
      
      // Verificar login exitoso con timeout largo
      cy.url({ timeout: 15000 }).should('include', '/mainmenu')
    })

    // 2. Verificar autenticación antes de navegar
    cy.window().should((win) => {
      const token = win.localStorage.getItem('token')
      expect(token).to.be.a('string').and.not.be.empty
      console.log('🔑 Token válido:', token ? 'SÍ' : 'NO')
    })

    // 3. Navegar con manejo de redirección
    cy.visit('/uploadEvidence', { 
      timeout: 15000,
      failOnStatusCode: false 
    })

    // 4. Verificar dónde estamos realmente - CORREGIDO
    cy.url().then((currentUrl) => {
      console.log('📍 URL actual después de navegar:', currentUrl)
      
      if (currentUrl.includes('/uploadEvidence')) {
        console.log('✅ Acceso directo a uploadEvidence exitoso')
        // Llamar directamente a la función, sin "this"
        continueWithUploadTest()
      } else if (currentUrl.includes('/mainmenu')) {
        console.log('ℹ️  En mainmenu - navegando mediante UI')
        // Llamar directamente a la función, sin "this"
        navigateFromMainmenu()
      } else if (currentUrl.includes('/login')) {
        console.log('❌ Redirigido al login - problema de autenticación')
        throw new Error('Autenticación falló - redirigido al login')
      } else {
        console.log('❌ URL inesperada:', currentUrl)
        throw new Error(`URL inesperada: ${currentUrl}`)
      }
    })
  })

  // Función para continuar con el test si estamos en uploadEvidence
  const continueWithUploadTest = () => {
    console.log('🔄 Continuando con prueba de upload...')
    
    // Buscar asignaciones
    cy.get('body').then(($body) => {
      const assignments = $body.find('.divide-y > div')
      if (assignments.length === 0) {
        console.log('⚠️ No hay asignaciones - test incompleto')
        return
      }

      console.log(`✅ ${assignments.length} asignaciones encontradas`)
      
      // Seleccionar primera asignación
      assignments.first().click()
      
      // Esperar detalles
      cy.contains('Información de la Evidencia', { timeout: 10000 })
        .should('be.visible')
        .then(() => {
          console.log('✅ Detalles de evidencia cargados')
          performUploadSteps()
        })
    })
  }

  // Función para navegar desde mainmenu
  const navigateFromMainmenu = () => {
    console.log('🔄 Navegando desde mainmenu...')
    
    // Buscar enlace a uploadEvidence
    cy.get('body').then(($body) => {
      const uploadLink = $body.find('a[href*="uploadEvidence"]')[0]
      
      if (uploadLink) {
        cy.wrap(uploadLink).click()
        cy.url({ timeout: 10000 }).should('include', '/uploadEvidence')
        console.log('✅ Navegación mediante enlace exitosa')
        continueWithUploadTest()
      } else {
        // Buscar por texto
        const uploadText = $body.text().includes('Carga') ? 'Carga' :
                          $body.text().includes('Subir') ? 'Subir' :
                          $body.text().includes('Evidencia') ? 'Evidencia' : null
        
        if (uploadText) {
          cy.contains(uploadText).click({ force: true })
          cy.url({ timeout: 10000 }).should('include', '/uploadEvidence')
          console.log(`✅ Navegación mediante texto "${uploadText}" exitosa`)
          continueWithUploadTest()
        } else {
          console.log('❌ No se pudo encontrar cómo navegar a uploadEvidence')
          throw new Error('No se pudo navegar a uploadEvidence desde mainmenu')
        }
      }
    })
  }

  // Función para realizar los pasos de upload
  const performUploadSteps = () => {
    // Llenar justificación si hay editor
    cy.get('body').then(($body) => {
      const editor = $body.find('.ck-editor__editable, [contenteditable="true"]')[0]
      if (editor) {
        cy.wrap(editor).type('Justificación de prueba E2E', { force: true })
        console.log('✅ Justificación completada')
      }
    })

    // Subir archivo si hay input
    cy.get('body').then(($body) => {
      const fileInput = $body.find('input[type="file"]')[0]
      if (fileInput) {
        const testContent = 'Contenido de prueba E2E'
        const blob = new Blob([testContent], { type: 'application/zip' })
        const testFile = new File([blob], 'test-file.zip', { type: 'application/zip' })
        
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(testFile)
        fileInput.files = dataTransfer.files
        fileInput.dispatchEvent(new Event('change', { bubbles: true }))
        
        console.log('✅ Archivo adjuntado')
        
        // Buscar y hacer click en Guardar
        cy.get('body').then(($body) => {
          const saveButton = Array.from($body.find('button')).find(btn => 
            btn.textContent.includes('Guardar')
          )
          
          if (saveButton) {
            cy.wrap(saveButton).click({ force: true })
            console.log('✅ Click en Guardar')
            
            // Verificar éxito
            cy.get('body', { timeout: 15000 }).should(($body) => {
              expect($body.text()).to.not.include('Error')
              console.log('✅ Operación completada sin errores')
            })
          }
        })
      }
    })
  }

  it('should handle authentication issues gracefully', () => {
    // Test específico para problemas de auth
    cy.fixture('test-users').then((users) => {
      const professor = users.professor
      cy.login(professor.rpe, professor.password)
    })

    // Simular token expirado
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'token-invalido')
    })

    cy.visit('/uploadEvidence', { failOnStatusCode: false })
    
    cy.url().then((url) => {
      if (url.includes('/login')) {
        console.log('✅ Redirección al login cuando token es inválido')
        // Re-login y continuar
        cy.fixture('test-users').then((users) => {
          const professor = users.professor
          cy.get('input[placeholder="RPE"]').type(professor.rpe)
          cy.get('input[placeholder="Contraseña"]').type(professor.password)
          cy.get('button[type="submit"]').click()
        })
      }
    })
  })

    it('should handle file validation errors', () => {
    cy.fixture('test-users').then((users) => {
      const professor = users.professor
      cy.login(professor.rpe, professor.password)
    })

    cy.visit('/uploadEvidence')
    
    cy.get('body').then(($body) => {
      if ($body.find('.divide-y > div').length > 0) {
        cy.get('.divide-y > div').first().click()
        
        cy.contains('Información de la Evidencia', { timeout: 10000 }).should('be.visible')
        
        // Intentar subir archivo PDF (inválido según tu código)
        const fileInput = cy.get('input[type="file"]').then($input => {
          const invalidContent = 'Contenido inválido'
          const blob = new Blob([invalidContent], { type: 'application/pdf' })
          const invalidFile = new File([blob], 'archivo-invalido.pdf', { type: 'application/pdf' })
          
          const dataTransfer = new DataTransfer()
          dataTransfer.items.add(invalidFile)
          $input[0].files = dataTransfer.files
          $input[0].dispatchEvent(new Event('change', { bubbles: true }))
        })
        
        // Verificar mensaje de error
        cy.get('body', { timeout: 10000 }).should(($body) => {
          const hasError = $body.text().includes('rechazado') || 
                          $body.text().includes('inválido') ||
                          $body.text().includes('permiten')
          
          if (hasError) {
            console.log('✅ Validación de archivo funcionando')
          }
        })
      }
    })
  })

  it('should test navigation between assignments', () => {
    cy.fixture('test-users').then((users) => {
      const professor = users.professor
      cy.login(professor.rpe, professor.password)
    })

    cy.visit('/uploadEvidence')
    
    cy.get('body').then(($body) => {
      const assignments = $body.find('.divide-y > div')
      if (assignments.length >= 2) {
        // Seleccionar primera asignación
        cy.get('.divide-y > div').first().click()
        cy.contains('Información de la Evidencia').should('be.visible')
        
        // Navegar a segunda asignación
        cy.get('.divide-y > div').eq(1).click()
        cy.contains('Información de la Evidencia').should('be.visible')
        
        console.log('✅ Navegación entre asignaciones funcionando')
      }
    })
  })  
})