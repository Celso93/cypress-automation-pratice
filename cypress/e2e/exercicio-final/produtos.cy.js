import * as produtos from '../../module/produtos/index.js'

describe('Exercício final - Produtos', { tags: '@exercicio-final' }, () => {

  beforeEach(() => {
    cy.visit('/')
  })

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
})
