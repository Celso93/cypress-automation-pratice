const seletores = {
    enderecoEntrega: '#address_delivery',
    itensPedido: '#cart_info',
    comentario: 'textarea[name="message"]',
    finalizarPedido: 'a[href="/payment"]',
    nomeCartao: 'input[data-qa=name-on-card]',
    numeroCartao: 'input[data-qa=card-number]',
    cvc: 'input[data-qa=cvc]',
    mesValidade: 'input[data-qa=expiry-month]',
    anoValidade: 'input[data-qa=expiry-year]',
    botaoPagar: 'button[data-qa=pay-button]',
    pedidoConfirmado: '[data-qa=order-placed]'
}

function finalizarPedido(comentario) {
    cy.get(seletores.comentario).type(comentario)
    cy.get(seletores.finalizarPedido).click()
}

function realizarPagamento() {
    cy.get(seletores.nomeCartao).type('John Doe')
    cy.get(seletores.numeroCartao).type('4111111111111111')
    cy.get(seletores.cvc).type('123')
    cy.get(seletores.mesValidade).type('12')
    cy.get(seletores.anoValidade).type('2030')
    cy.get(seletores.botaoPagar).click()
}

function validarEnderecoEPedido(produto) {
    cy.contains('h2', 'Address Details').should('be.visible')
    cy.get(seletores.enderecoEntrega)
        .should('contain', 'John Doe')
        .and('contain', '123 Main St')
        .and('contain', 'Los Angeles')
        .and('contain', 'California')
        .and('contain', '90001')
        .and('contain', 'United States')
    cy.contains('h2', 'Review Your Order').should('be.visible')
    cy.get(seletores.itensPedido).should('contain', produto)
}

function validarPedidoConfirmado() {
    cy.get(seletores.pedidoConfirmado).should('be.visible').and('contain', 'Order Placed!')
    cy.contains('p', 'Congratulations! Your order has been confirmed!').should('be.visible')
}

export {
    finalizarPedido,
    realizarPagamento,
    validarEnderecoEPedido,
    validarPedidoConfirmado
}
