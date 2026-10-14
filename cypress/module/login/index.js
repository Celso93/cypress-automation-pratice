function loginUsuario(email, senha) {
    cy.xpath("//h2[contains(text(),'Login to your account')]").should('be.visible')
    cy.xpath("//input[@data-qa='login-email']").type(email)
    cy.xpath("//input[@data-qa='login-password']").type(senha)
    cy.xpath("//button[@data-qa='login-button']").click()
}

export { loginUsuario }