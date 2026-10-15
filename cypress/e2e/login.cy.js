import * as cadastro from '../module/cadastro/index.js'
import * as login from '../module/login/index.js'

const senhaCorreta = '123456'

describe('Formulário de login', () => {

  let emailAleatorio;

  beforeEach(() => {
    emailAleatorio = `john.doe.${Date.now()}@example.com`
  })

  context('Com usuário cadastrado', () => {

    beforeEach(() => {
      cy.visit('/')
      cadastro.cadastroNovoUsuario(emailAleatorio)
      cy.get('a[href="/logout"]').click()
    })

    afterEach(() => {
      cy.get('a[href="/delete_account"]').click()
      cy.deletarConta()
    })

    it('Enviar o login pressionando Enter no campo de e-mail', () => {
      login.realizarLoginComEnter(emailAleatorio, senhaCorreta, 'email')
      login.validarLoginComSucesso(emailAleatorio)
    })

    it('Enviar o login pressionando Enter no campo de senha', () => {
      login.realizarLoginComEnter(emailAleatorio, senhaCorreta, 'senha')
      login.validarLoginComSucesso(emailAleatorio)
    })

    it('Login com e-mail cadastrado e senha incorreta', () => {
      login.realizarLogin(emailAleatorio, 'SenhaIncorreta!123')
      login.validarLoginComFalha(emailAleatorio, 'SenhaIncorreta!123')
      login.realizarLogin(emailAleatorio, senhaCorreta)
    })
  })

  context('Validações do navegador (HTML5)', () => {

    beforeEach(() => {
      login.acessarTelaLogin()
    })

    it('Exibir validação de campo obrigatório com e-mail e senha vazios', () => {
      login.realizarLogin('', '')
      login.validarBloqueioDoNavegador('valueMissing', 'email', 'senha')
    })

   const emailsInvalidos = ['usuario', 'usuario@', 'usuario@.com']

    emailsInvalidos.forEach((emailInvalido) => {
      it(`Impedir login com e-mail inválido: ${emailInvalido}`, () => {
        login.realizarLogin(emailInvalido, 'SenhaValida!123')
        login.validarBloqueioDoNavegador('typeMismatch', 'email')
      })
    })
  })
})
