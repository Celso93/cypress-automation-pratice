describe('template spec', () => {

  beforeEach(() => {
    cy.visit('https://www.automationexercise.com/')
    cy.get('.features_items').should('be.visible')
  })


  it('Cadastrar um novo usuário com sucesso', () => {
    const emailAleatorio = `john.doe.${Date.now()}@example.com`
    cy.cadastroNovoUsuario(emailAleatorio)

    cy.get('.navbar-nav').should('contain.text', 'Logged in as John Doe')
    cy.get('a[href="/delete_account"]').click()
    cy.get('[data-qa=account-deleted]').should('be.visible').and('contain', 'Account Deleted!')
    cy.get('[data-qa=continue-button]').click()
  })

  it.only('Login com email e senha corretos', () => {
    const email =  `john.doe.${Date.now()}@example.com`
    const senha = '123456'
    cy.cadastroNovoUsuario(email)

    cy.get('a[href="/login"]').click()
    cy.contains('h2', 'Login to your account').should('be.visible')

    cy.get('input[data-qa=login-email]').type(email)
    cy.get('input[data-qa=login-password]').type(senha)
    cy.get('button[data-qa=login-button]').click()

    cy.get('.navbar-nav').should('contain.text', 'Logged in as')

    cy.get('a[href="/delete_account"]').click()

    cy.get('[data-qa=account-deleted]').should('be.visible').and('contain', 'Account Deleted!')
  })

  it('Login com email e senha incorretos', () => {

    cy.get('a[href="/login"]').click()
    cy.contains('h2', 'Login to your account').should('be.visible')

    cy.get('input[data-qa=login-email]').type('email.invalido@example.com')
    cy.get('input[data-qa=login-password]').type('senhaErrada123')
    cy.get('button[data-qa=login-button]').click()

    cy.contains('Your email or password is incorrect!').should('be.visible')
  })

  it('Logout de usuário', () => {
    const email = Cypress.env('EMAIL')
    const senha = Cypress.env('PASSWORD')

    cy.get('a[href="/login"]').click()
    cy.contains('h2', 'Login to your account').should('be.visible')

    cy.get('input[data-qa=login-email]').type(email)
    cy.get('input[data-qa=login-password]').type(senha)
    cy.get('button[data-qa=login-button]').click()

    cy.get('.navbar-nav').should('contain.text', 'Logged in as')

    cy.get('a[href="/logout"]').click()

    cy.contains('h2', 'Login to your account').should('be.visible')
    cy.url().should('include', '/login')
  })

  it('Cadastro de usuário com email já existente', () => {
    const emailExistente = Cypress.env('EMAIL')

    cy.get('a[href="/login"]').click()
    cy.contains('h2', 'New User Signup!').should('be.visible')

    cy.get('input[data-qa=signup-name]').type('John Doe')
    cy.get('input[data-qa=signup-email]').type(emailExistente)
    cy.get('button[data-qa=signup-button]').click()

    cy.contains('Email Address already exist!').should('be.visible')
  })
})
