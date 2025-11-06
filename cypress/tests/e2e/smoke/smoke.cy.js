describe('Smoke Test', () => {
  it('should load the application', () => {
    cy.visit('/')
    cy.contains('Bienvenido').should('be.visible')
  })
})