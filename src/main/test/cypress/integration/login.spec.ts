describe('Login', () => {
  beforeEach(() => {
    cy.visit('login')
  })
  it('Should load with correct init state', () => {
    cy.getByTestId('email-status').should('have.attr', 'title', 'Campo obrigatório')
    cy.getByTestId('password-status').should('have.attr', 'title', 'Campo obrigatório')
  })
})
