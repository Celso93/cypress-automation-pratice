Cypress.Commands.add('login', (email, senha) => {
    cy.xpath("//h2[contains(text(),'Login to your account')]").should('be.visible')
    cy.xpath("//input[@data-qa='login-email']").type(email)
    cy.xpath("//input[@data-qa='login-password']").type(senha)
    cy.xpath("//button[@data-qa='login-button']").click()
})

Cypress.Commands.add('deletarConta', () => {
    cy.get('[data-qa=account-deleted]').should('be.visible').and('contain', 'Account Deleted!')
    cy.get('[data-qa=continue-button]').click()
})
