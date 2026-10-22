import * as cadastro from '../module/cadastro/index.js'
import * as login from '../module/login/index.js'
import * as produtos from '../module/produtos/index.js'
import * as inscricao from '../module/inscricao/index.js'
import * as carrinho from '../module/carrinho/index.js'
import * as checkout from '../module/checkout/index.js'

const senhaCorreta = '123456'

describe('Exercício de Automação - Cenários 8,9,10,15 e 16', () => {

  let emailAleatorio;

  beforeEach(() => {
    emailAleatorio = `john.doe.${Date.now()}@example.com`
    cy.visit('/')
    cy.get('#slider').should('be.visible')
  })

  context('Produtos e Home (sem usuário logado)', () => {

    it('Test Case 8: Verify All Products and product detail page', () => {
      produtos.acessarTelaProdutos()
      produtos.validarListaDeProdutosVisivel()
      produtos.acessarDetalhesPrimeiroProduto()
      produtos.validarDetalhesDoProduto()
    })

    it('Test Case 9: Search Product', () => {
      const produtoPesquisado = 'Jeans'

      produtos.acessarTelaProdutos()
      produtos.pesquisarProduto(produtoPesquisado)
      produtos.validarProdutosPesquisados(produtoPesquisado)
    })

    it('Test Case 10: Verify Subscription in home page', () => {
      inscricao.acessarRodape()
      inscricao.validarSecaoInscricaoVisivel()
      inscricao.realizarInscricao(emailAleatorio)
      inscricao.validarInscricaoComSucesso()
    })
  })

  context('Place Order', () => {

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
})
