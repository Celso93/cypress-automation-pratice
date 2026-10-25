import * as cadastro from '../../module/cadastro/index.js'
import * as login from '../../module/login/index.js'

const senhaCorreta = '123456'

describe('Exercício final - Usuário', { tags: '@exercicio-final' }, () => {

  let emailAleatorio;

  beforeEach(() => {
    emailAleatorio = `john.doe.${Date.now()}@example.com`
    cy.visit('/')
  })

  it('Test Case 1: Register User', () => {
    cadastro.cadastroNovoUsuario(emailAleatorio)
    login.validarUsuarioLogado()

    cadastro.excluirConta()
  })

  it('Test Case 2: Login User with correct email and password', () => {
    cadastro.cadastroNovoUsuario(emailAleatorio)
    login.realizarLogout()

    login.realizarLogin(emailAleatorio, senhaCorreta)
    login.validarLoginComSucesso(emailAleatorio)

    cadastro.excluirConta()
  })

  it('Test Case 3: Login User with incorrect email and password', () => {
    login.acessarTelaLogin()
    login.realizarLogin('email.invalido@example.com', 'senhaErrada123')
    login.validarLoginComFalha('email.invalido@example.com', 'senhaErrada123')
  })

  it('Test Case 4: Logout User', () => {
    cadastro.cadastroNovoUsuario(emailAleatorio)
    login.realizarLogout()
    login.validarLogoutRealizado()

    login.realizarLogin(emailAleatorio, senhaCorreta)
    cadastro.excluirConta()
  })

  it('Test Case 5: Register User with existing email', () => {
    cadastro.cadastroNovoUsuario(emailAleatorio)
    login.realizarLogout()

    cadastro.cadastroUsuarioTelaLogin(emailAleatorio)
    cadastro.validarEmailJaCadastrado()

    login.acessarTelaLogin()
    login.realizarLogin(emailAleatorio, senhaCorreta)
    cadastro.excluirConta()
  })
})
