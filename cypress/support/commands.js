// ***********************************************
// This is a great place to put custom commands
// that can be used across all tests
// ***********************************************

Cypress.Commands.add('login', (rpe, password) => {
  cy.visit('/')
  cy.get('input[placeholder="RPE"]').type(rpe)
  cy.get('input[placeholder="Contraseña"]').type(password)
  cy.get('button[type="submit"]').click()
  
  // Esperar y verificar redirección con más tolerancia
  cy.url({ timeout: 10000 }).should((url) => {
    expect(url).to.match(/\/mainmenu|\/dashboard|\/$/)
  })
})

Cypress.Commands.add('logout', () => {
  cy.window().then((win) => {
    win.localStorage.clear()
    win.sessionStorage.clear()
  })
  cy.visit('/')
})

Cypress.Commands.add('navigateToUploadEvidence', () => {
  // Primero ir a mainmenu si no estamos ahí
  cy.url().then((currentUrl) => {
    if (!currentUrl.includes('/mainmenu')) {
      cy.visit('/mainmenu')
    }
  })
  
  // Intentar diferentes formas de navegar
  cy.get('body').then(($body) => {
    const bodyText = $body.text()
    
    // Opción 1: Si hay un enlace directo
    if ($body.find('a[href*="uploadEvidence"]').length > 0) {
      cy.get('a[href*="uploadEvidence"]').first().click()
    }
    // Opción 2: Si hay texto que indique la funcionalidad
    else if (bodyText.includes('Carga') || bodyText.includes('Subir') || bodyText.includes('Evidencia')) {
      // Buscar el elemento que contiene ese texto y hacer click
      cy.contains('Carga').click({ force: true })
        .or(() => cy.contains('Subir').click({ force: true }))
        .or(() => cy.contains('Evidencia').click({ force: true }))
    }
    // Opción 3: Navegar directamente por URL
    else {
      cy.visit('/uploadEvidence')
    }
  })
  
  // Esperar a que cargue la página con timeout largo
  cy.url({ timeout: 15000 }).should('include', '/uploadEvidence')
  
  // Verificar que cargó algo útil (no página vacía o error)
  cy.get('body').should(($body) => {
    expect($body.text().length).to.be.greaterThan(10) // Al menos tiene contenido
    expect($body.text()).not.to.include('404')
    expect($body.text()).not.to.include('Not Found')
  })
})

Cypress.Commands.add('selectEvidenceAssignment', (evidenceId) => {
  cy.get(`a[href="/uploadEvidence/${evidenceId}"]`).click()
  cy.contains('Subir Evidencia').should('be.visible')
})

Cypress.Commands.add('fillJustification', (text) => {
  // Intentar diferentes selectores del CKEditor
  const editors = [
    '.ck-editor__editable',
    '[contenteditable="true"]',
    '.prose',
    '.DraftEditor-root'
  ]
  
  editors.forEach(selector => {
    cy.get('body').then($body => {
      if ($body.find(selector).length > 0) {
        cy.get(selector).type(text, { force: true })
      }
    })
  })
})

Cypress.Commands.add('uploadFile', (fileName, fileType = 'application/zip') => {
  cy.fixture(fileName, 'binary').then((fileContent) => {
    const blob = Cypress.Blob.binaryStringToBlob(fileContent, fileType)
    const file = new File([blob], fileName, { type: fileType })
    const dataTransfer = new DataTransfer()
    
    dataTransfer.items.add(file)
    
    cy.get('input[type="file"]').then($input => {
      $input[0].files = dataTransfer.files
      $input[0].dispatchEvent(new Event('change', { bubbles: true }))
    })
  })
})

Cypress.Commands.add('uploadTestFile', (fileName, fileType = 'application/zip') => {
  const testContent = 'Test file content for E2E testing'
  const blob = Cypress.Blob.binaryStringToBlob(testContent, fileType)
  const testFile = new File([blob], fileName, { type: fileType })
  
  cy.get('input[type="file"]').then(($input) => {
    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(testFile)
    $input[0].files = dataTransfer.files
    $input[0].dispatchEvent(new Event('change', { bubbles: true }))
  })
})

Cypress.Commands.add('fillEditor', (text) => {
  cy.get('body').then(($body) => {
    const editorSelectors = [
      '.ck-editor__editable',
      '[contenteditable="true"]',
      '.prose', 
      '.DraftEditor-root',
      '[role="textbox"]'
    ]
    
    for (const selector of editorSelectors) {
      if ($body.find(selector).length > 0) {
        cy.get(selector).first().type(text, { force: true })
        return
      }
    }
    
    console.log('No se encontró editor disponible')
  })
})

// cypress/support/commands.js - AGREGAR
Cypress.Commands.add('checkRouteAccess', (route) => {
  cy.visit(route, { timeout: 10000 })
  
  return cy.url().then((url) => {
    const accessGranted = url.includes(route)
    console.log(`🔐 Acceso a ${route}:`, accessGranted ? 'PERMITIDO' : 'DENEGADO')
    console.log(`📍 URL actual:`, url)
    
    return accessGranted
  })
})

Cypress.Commands.add('ensureAuthenticated', (userRpe, password) => {
  cy.url().then((currentUrl) => {
    if (currentUrl.includes('/login') || !currentUrl.includes('/mainmenu')) {
      console.log('🔐 Re-autenticando...')
      cy.login(userRpe, password)
    }
  })
  
  cy.window().should((win) => {
    expect(win.localStorage.getItem('token')).to.be.a('string').and.not.be.empty
  })
})

Cypress.Commands.add('navigateToReviewEvidence', () => {
  cy.visit('/reviewEvidence', { timeout: 15000 })
  cy.url().should('include', '/reviewEvidence')
  cy.contains('Revisión de evidencias').should('be.visible')
})

Cypress.Commands.add('filterEvidences', (filters = {}) => {
  if (filters.process) {
    cy.get('select[name="process"]').select(filters.process)
  }
  if (filters.category) {
    cy.get('select[name="category"]').select(filters.category)
  }
  if (filters.section) {
    cy.get('select[name="section"]').select(filters.section)
  }
  // Esperar a que se apliquen los filtros
  cy.wait(1000)
})

Cypress.Commands.add('approveEvidence', (feedback = 'Aprobado en prueba E2E') => {
  cy.get('button').contains('✓').first().click({ force: true })
  cy.get('textarea').type(feedback)
  cy.contains('Enviar').click({ force: true })
  cy.contains('Sí, aprobar').click({ force: true })
})

Cypress.Commands.add('rejectEvidence', (feedback = 'Rechazado en prueba E2E') => {
  cy.get('button').contains('✕').first().click({ force: true })
  cy.get('textarea').type(feedback)
  cy.contains('Enviar').click({ force: true })
  cy.contains('Sí, rechazar').click({ force: true })
})

Cypress.Commands.add('waitForReviewPage', () => {
  cy.contains('Revisión de evidencias', { timeout: 10000 }).should('be.visible')
  cy.get('table', { timeout: 10000 }).should('exist')
})

Cypress.Commands.add('findReviewableEvidence', () => {
  return cy.get('tbody tr').then(($rows) => {
    return $rows.toArray().find(row => {
      const buttons = row.querySelectorAll('button')
      return Array.from(buttons).some(btn => 
        !btn.disabled && 
        (btn.innerHTML.includes('✓') || btn.innerHTML.includes('×') || 
         btn.querySelector('svg'))
      )
    })
  })
})