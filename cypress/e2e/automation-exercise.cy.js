describe('template spec', () => {

  let emailAleatorio;

  beforeEach(() => {
    cy.visit('https://www.automationexercise.com/')
    cy.get('.features_items').should('be.visible')
    emailAleatorio = `john.doe.${Date.now()}@example.com`
  })


  it('Cadastrar um novo usuário com sucesso', () => {
    cy.cadastroNovoUsuario(emailAleatorio)
    cy.get('.navbar-nav').should('contain.text', 'Logged in as John Doe')
    cy.get('a[href="/delete_account"]').click()
    cy.deletarConta()
  })

  it('Login com email e senha corretos', () => {
    cy.cadastroNovoUsuario(emailAleatorio)
    cy.get("a[href='/logout']").should('be.visible').click()
    cy.login(emailAleatorio, '123456')
    cy.get('.navbar-nav').should('contain.text', 'Logged in as')
    cy.get('a[href="/delete_account"]').click()
    cy.deletarConta()
  })

  it('Login com email e senha incorretos', () => {
    cy.get('a[href="/login"]').click()
    cy.login('email.invalido@example.com', 'senhaErrada123')
    cy.contains('Your email or password is incorrect!').should('be.visible')
  })

  it('Logout de usuário', () => {
    cy.cadastroNovoUsuario(emailAleatorio)
    cy.get('a[href="/logout"]').click()
    cy.url().should('include', '/login')
  })

  it('Cadastro de usuário com email já existente', () => {
    cy.cadastroNovoUsuario(emailAleatorio)
    cy.get('a[href="/logout"]').click()
    cy.cadastroUsuarioTelaLogin(emailAleatorio)
    cy.contains('Email Address already exist!').should('be.visible')
  })
})
