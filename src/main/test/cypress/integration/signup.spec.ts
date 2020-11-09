import faker from 'faker'

const baseUrl = 'http://localhost:3000'

describe('Signup', () => {
  beforeEach(() => {
    cy.server()
    cy.visit('signup')
  })

  it('Should load with correct init state', () => {
    cy.getByTestId('name-status').should('have.attr', 'title', 'Campo obrigatório')
    cy.getByTestId('email-status').should('have.attr', 'title', 'Campo obrigatório')
    cy.getByTestId('password-status').should('have.attr', 'title', 'Campo obrigatório')
    cy.getByTestId('passwordConfirmation-status').should('have.attr', 'title', 'Campo obrigatório')
    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('Should present erro if state form is invalid', () => {
    cy.getByTestId('name').focus().type(faker.random.alphaNumeric(3))
    cy.getByTestId('email').focus().type(faker.random.word())
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(3))
    cy.getByTestId('passwordConfirmation').focus().type(faker.random.alphaNumeric(3))
    cy.getByTestId('name-status')
      .should('have.attr', 'title', 'Valor inválido')
      .should('contain.text', '🔴')
    cy.getByTestId('email-status')
      .should('have.attr', 'title', 'Valor inválido')
      .should('contain.text', '🔴')
    cy.getByTestId('password-status')
      .should('have.attr', 'title', 'Valor inválido')
      .should('contain.text', '🔴')
    cy.getByTestId('passwordConfirmation-status')
      .should('have.attr', 'title', 'Valor inválido')
      .should('contain.text', '🔴')
    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('Should valid if state form is valid', () => {
    const password = faker.random.alphaNumeric(5)
    cy.getByTestId('name').focus().type(faker.random.alphaNumeric(5))
    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('password').focus().type(password)
    cy.getByTestId('passwordConfirmation').focus().type(password)
    cy.getByTestId('name-status').should('have.attr', 'title', 'Tudo certo!')
    cy.getByTestId('email-status').should('have.attr', 'title', 'Tudo certo!')
    cy.getByTestId('password-status').should('have.attr', 'title', 'Tudo certo!')
    cy.getByTestId('passwordConfirmation-status').should('have.attr', 'title', 'Tudo certo!')
    cy.getByTestId('submit').should('not.have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })
  it('Should present erro if emailInUseError are provided', () => {
    cy.route({
      method: 'POST',
      url: /signup/,
      status: 403,
      response: {
        error: faker.random.words(5)
      }
    })
    const password = faker.random.alphaNumeric(5)
    cy.getByTestId('name').focus().type(faker.random.alphaNumeric(5))
    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('password').focus().type(password)
    cy.getByTestId('passwordConfirmation').focus().type(password)
    cy.getByTestId('submit').click()
    cy.getByTestId('main-error').should('contain.text', 'Esse e-mail já está em uso')
    cy.url().should('eq', `${baseUrl}/signup`)
  })

  it('Should save accessToken if credentials are provided', () => {
    cy.route({
      method: 'POST',
      url: /signup/,
      status: 200,
      response: {
        accessToken: faker.random.uuid()
      }
    })
    const password = faker.random.alphaNumeric(5)
    cy.getByTestId('name').focus().type(faker.random.alphaNumeric(5))
    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('password').focus().type(password)
    cy.getByTestId('passwordConfirmation').focus().type(password)
    cy.getByTestId('submit').click()
    cy.getByTestId('main-error').should('not.exist')
    cy.getByTestId('spinner').should('not.exist')
    cy.url().should('eq', `${baseUrl}/`)
    cy.window().then((window) => assert.isOk(window.localStorage.getItem('accessToken')))
  })
})
