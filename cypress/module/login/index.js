const seletores = {
    formulario: 'form[action="/login"]',
    email: 'input[data-qa=login-email]',
    senha: 'input[data-qa=login-password]',
    botao: 'button[data-qa=login-button]',
    logout: 'a[href="/logout"]',
    menu: '.navbar-nav'
}

function acessarTelaLogin() {
    cy.visit('/login')
    cy.contains('h2', 'Login to your account').should('be.visible')
}

function preencherCredenciais(email, senha) {
    cy.intercept('POST', '**/login').as('requisicaoLogin')
    if (email) cy.get(seletores.email).clear().type(email)
    if (senha) cy.get(seletores.senha).clear().type(senha)
}

function realizarLogin(email, senha) {
    preencherCredenciais(email, senha)
    cy.get(seletores.botao).click()
}

function realizarLoginComEnter(email, senha, campo = 'senha') {
    preencherCredenciais(email, senha)
    cy.get(seletores[campo]).type('{enter}')
}

function realizarLogout() {
    cy.get(seletores.logout).click()
}

function validarCredenciaisEnviadas(email, senha) {
    cy.wait('@requisicaoLogin').its('request.body').then((corpo) => {
        const parametros = new URLSearchParams(corpo)
        expect(parametros.get('email')).to.eq(email)
        if (senha) expect(parametros.get('password')).to.eq(senha)
    })
}

function validarUsuarioLogado(nome = 'John Doe') {
    cy.get(seletores.menu).should('contain.text', `Logged in as ${nome}`)
}

function validarLoginComSucesso(email, nome = 'John Doe') {
    validarCredenciaisEnviadas(email)
    validarUsuarioLogado(nome)
}

function validarLoginComFalha(email, senha) {
    validarCredenciaisEnviadas(email, senha)
    cy.url().should('include', '/login')
    cy.contains('Your email or password is incorrect!').should('be.visible')
}

function validarBloqueioDoNavegador(regra, ...campos) {
    campos.forEach((campo) => {
        cy.get(seletores[campo])
            .should('have.prop', 'validity')
            .and('have.property', regra, true)
        cy.get(seletores[campo])
            .invoke('prop', 'validationMessage')
            .should('not.be.empty')
    })
    cy.url().should('include', '/login')
    cy.get('@requisicaoLogin.all').should('have.length', 0)
}

export {
    acessarTelaLogin,
    realizarLogin,
    realizarLoginComEnter,
    realizarLogout,
    validarUsuarioLogado,
    validarLoginComSucesso,
    validarLoginComFalha,
    validarBloqueioDoNavegador
}
