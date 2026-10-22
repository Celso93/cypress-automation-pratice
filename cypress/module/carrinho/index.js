const seletores = {
    adicionarAoCarrinho: '.productinfo .add-to-cart',
    modal: '#cartModal',
    continuarComprando: '.close-modal',
    menuCarrinho: '.shop-menu a[href="/view_cart"]',
    tabelaCarrinho: '#cart_info_table',
    prosseguirCheckout: '.check_out'
}

function adicionarPrimeiroProduto() {
    cy.get(seletores.adicionarAoCarrinho).first().click()
    cy.get(seletores.modal).should('be.visible')
    cy.get(seletores.continuarComprando).click()
}

function acessarCarrinho() {
    cy.get(seletores.menuCarrinho).click()
}

function prosseguirParaCheckout() {
    cy.get(seletores.prosseguirCheckout).click()
}

function validarCarrinhoVisivel() {
    cy.url().should('include', '/view_cart')
    cy.get(seletores.tabelaCarrinho).should('be.visible')
}

export {
    adicionarPrimeiroProduto,
    acessarCarrinho,
    prosseguirParaCheckout,
    validarCarrinhoVisivel
}
