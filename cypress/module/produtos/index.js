const seletores = {
    menuProdutos: 'a[href="/products"]',
    titulo: 'h2.title',
    listaProdutos: '.features_items .product-image-wrapper',
    verProduto: '.choose a[href^="/product_details/"]',
    detalhesProduto: '.product-information',
    campoBusca: '#search_product',
    botaoBusca: '#submit_search',
    nomesProdutos: '.features_items .productinfo p'
}

function acessarTelaProdutos() {
    cy.get(seletores.menuProdutos).click()
    cy.url().should('include', '/products')
    cy.contains(seletores.titulo, 'All Products').should('be.visible')
}

function acessarDetalhesPrimeiroProduto() {
    cy.get(seletores.verProduto).first().click()
    cy.url().should('include', '/product_details/1')
}

function pesquisarProduto(nomeProduto) {
    cy.get(seletores.campoBusca).type(nomeProduto)
    cy.get(seletores.botaoBusca).click()
}

function validarListaDeProdutosVisivel() {
    cy.get(seletores.listaProdutos).should('have.length.greaterThan', 0)
}

function validarDetalhesDoProduto() {
    cy.get(seletores.detalhesProduto).within(() => {
        cy.get('h2').should('be.visible').and('not.be.empty')
        cy.contains('p', 'Category:').should('be.visible')
        cy.contains('span', 'Rs.').should('be.visible')
        cy.contains('p', 'Availability:').should('be.visible')
        cy.contains('p', 'Condition:').should('be.visible')
        cy.contains('p', 'Brand:').should('be.visible')
    })
}

function validarProdutosPesquisados(nomeProduto) {
    cy.contains(seletores.titulo, 'Searched Products').should('be.visible')
    cy.get(seletores.nomesProdutos)
        .should('have.length.greaterThan', 0)
        .each(($nome) => {
            expect($nome.text().toLowerCase()).to.include(nomeProduto.toLowerCase())
        })
}

export {
    acessarTelaProdutos,
    acessarDetalhesPrimeiroProduto,
    pesquisarProduto,
    validarListaDeProdutosVisivel,
    validarDetalhesDoProduto,
    validarProdutosPesquisados
}
