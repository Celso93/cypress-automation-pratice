import * as cadastro from '../module/cadastro/index.js'
import * as login from '../module/login/index.js'

describe('template spec', () => {

  let emailAleatorio;

  beforeEach(() => {
    cy.visit('https://www.automationexercise.com/')
    cy.get('.features_items').should('be.visible')
    emailAleatorio = `john.doe.${Date.now()}@example.com`
  })


  it('Cadastrar um novo usuário com sucesso', () => {
    cadastro.cadastroNovoUsuario(emailAleatorio)
    cy.get('.navbar-nav').should('contain.text', 'Logged in as John Doe')
    cy.get('a[href="/delete_account"]').click()
    cy.deletarConta()
  })

  it('Login com email e senha corretos', () => {
    cadastro.cadastroNovoUsuario(emailAleatorio)
    cy.get("a[href='/logout']").should('be.visible').click()
    login.realizarLogin(emailAleatorio, '123456')
    login.validarLoginComSucesso(emailAleatorio)
    cy.get('a[href="/delete_account"]').click()
    cy.deletarConta()
  })

  it('Login com email e senha incorretos', () => {
    cy.get('a[href="/login"]').click()
    login.realizarLogin('email.invalido@example.com', 'senhaErrada123')
    login.validarLoginComFalha('email.invalido@example.com', 'senhaErrada123')
  })

  it('Logout de usuário', () => {
    cadastro.cadastroNovoUsuario(emailAleatorio)
    cy.get('a[href="/logout"]').click()
    cy.url().should('include', '/login')
  })

  it('Cadastro de usuário com email já existente', () => {
    cadastro.cadastroNovoUsuario(emailAleatorio)
    cy.get('a[href="/logout"]').click()
    cadastro.cadastroUsuarioTelaLogin(emailAleatorio)
    cy.contains('Email Address already exist!').should('be.visible')
  })
})
