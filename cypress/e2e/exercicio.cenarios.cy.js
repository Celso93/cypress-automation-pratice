import * as cadastro from '../module/cadastro/index.js'
import * as login from '../module/login/index.js'

describe('Exercício de Automação - Cenários 1 a 5', () => {

  let emailAleatorio;

  beforeEach(() => {
    cy.visit('/')
    emailAleatorio = `john.doe.${Date.now()}@example.com`
  })


  it('Test Case 1: Register User', () => {
    cadastro.cadastroNovoUsuario(emailAleatorio)
    cy.get('.navbar-nav').should('contain.text', 'Logged in as John Doe')
    cy.get('a[href="/delete_account"]').click()
    cy.deletarConta()
  })

  it('Test Case 2: Login User with correct email and password', () => {
    cadastro.cadastroNovoUsuario(emailAleatorio)
    cy.get("a[href='/logout']").should('be.visible').click()
    login.realizarLogin(emailAleatorio, '123456')
    login.validarLoginComSucesso(emailAleatorio)
    cy.get('a[href="/delete_account"]').click()
    cy.deletarConta()
  })

  it('Test Case 3: Login User with incorrect email and password', () => {
    cy.get('a[href="/login"]').click()
    login.realizarLogin('email.invalido@example.com', 'senhaErrada123')
    login.validarLoginComFalha('email.invalido@example.com', 'senhaErrada123')
  })

  it('Test Case 4: Logout User', () => {
    cadastro.cadastroNovoUsuario(emailAleatorio)
    cy.get('a[href="/logout"]').click()
    cy.url().should('include', '/login')
  })

  it('Test Case 5: Register User with existing email', () => {
    cadastro.cadastroNovoUsuario(emailAleatorio)
    cy.get('a[href="/logout"]').click()
    cadastro.cadastroUsuarioTelaLogin(emailAleatorio)
    cy.contains('Email Address already exist!').should('be.visible')
  })
})
