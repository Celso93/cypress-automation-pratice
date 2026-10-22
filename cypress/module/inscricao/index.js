const seletores = {
    titulo: '.single-widget h2',
    email: '#susbscribe_email',
    botao: '#subscribe',
    mensagemSucesso: '#success-subscribe'
}

function acessarRodape() {
    cy.scrollTo('bottom')
}

function realizarInscricao(email) {
    cy.get(seletores.email).type(email)
    cy.get(seletores.botao).click()
}

function validarSecaoInscricaoVisivel() {
    cy.contains(seletores.titulo, 'Subscription').should('be.visible')
}

function validarInscricaoComSucesso() {
    cy.get(seletores.mensagemSucesso)
        .should('be.visible')
        .and('contain', 'You have been successfully subscribed!')
}

export {
    acessarRodape,
    realizarInscricao,
    validarSecaoInscricaoVisivel,
    validarInscricaoComSucesso
}
