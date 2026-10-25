import * as cadastro from '../../module/cadastro/index.js'
import * as login from '../../module/login/index.js'
import * as carrinho from '../../module/carrinho/index.js'
import * as checkout from '../../module/checkout/index.js'

const senhaCorreta = '123456'

describe('Exercício final - Pedido', { tags: '@exercicio-final' }, () => {

  let emailAleatorio;

  beforeEach(() => {
    emailAleatorio = `john.doe.${Date.now()}@example.com`
    cy.visit('/')
  })

  it('Test Case 15: Place Order: Register before Checkout', () => {
    cadastro.cadastroNovoUsuario(emailAleatorio)
    login.validarUsuarioLogado()

    carrinho.adicionarPrimeiroProduto()
    carrinho.acessarCarrinho()
    carrinho.validarCarrinhoVisivel()
    carrinho.prosseguirParaCheckout()

    checkout.validarEnderecoEPedido('Blue Top')
    checkout.finalizarPedido('Pedido de teste automatizado')
    checkout.realizarPagamento()
    checkout.validarPedidoConfirmado()

    cadastro.excluirConta()
  })

  it('Test Case 16: Place Order: Login before Checkout', () => {
    cadastro.cadastroNovoUsuario(emailAleatorio)
    login.realizarLogout()

    login.acessarTelaLogin()
    login.realizarLogin(emailAleatorio, senhaCorreta)
    login.validarLoginComSucesso(emailAleatorio)

    carrinho.adicionarPrimeiroProduto()
    carrinho.acessarCarrinho()
    carrinho.validarCarrinhoVisivel()
    carrinho.prosseguirParaCheckout()

    checkout.validarEnderecoEPedido('Blue Top')
    checkout.finalizarPedido('Pedido de teste automatizado')
    checkout.realizarPagamento()
    checkout.validarPedidoConfirmado()

    cadastro.excluirConta()
  })
})
