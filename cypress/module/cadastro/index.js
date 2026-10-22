function cadastroUsuarioTelaLogin(email) {
    cy.get('input[data-qa=signup-name]').type('John Doe')
    cy.get('input[data-qa=signup-email]').type(email)
    cy.get('button[data-qa=signup-button]').click()
}

function cadastroNovoUsuario(email) {
    cy.get('a[href="/login"]').click()
    cy.contains('h2', 'New User Signup!').should('be.visible')

    cadastroUsuarioTelaLogin(email)
    cy.contains('h2', 'Enter Account Information').should('be.visible')

    cy.get('#id_gender1').click()
    cy.get('input[data-qa=password]').type('123456')
    cy.get('select[data-qa=days]').select('10')
    cy.get('select[data-qa=months]').select('May')
    cy.get('select[data-qa=years]').select('1995')

    cy.get('#newsletter').click()
    cy.get('#optin').click()

    cy.get('input[data-qa=first_name]').type('John')
    cy.get('input[data-qa=last_name]').type('Doe')
    cy.get('input[data-qa=company]').type('Empresa Teste')

    cy.get('input[data-qa=address]').type('123 Main St')
    cy.get('input[data-qa=address2]').type('Apto 4')
    cy.get('select[data-qa=country]').select('United States')
    cy.get('input[data-qa=state]').type('California')
    cy.get('input[data-qa=city]').type('Los Angeles')
    cy.get('input[data-qa=zipcode]').type('90001')
    cy.get('input[data-qa=mobile_number]').type('+1 123 456 7890')

    cy.get('button[data-qa=create-account]').click()

    cy.get('[data-qa=account-created]').should('be.visible').and('contain', 'Account Created!')
    cy.get('[data-qa=continue-button]').click()
}

function excluirConta() {
    cy.get('a[href="/delete_account"]').click()
    cy.deletarConta()
}

export {
    cadastroNovoUsuario,
    cadastroUsuarioTelaLogin,
    excluirConta
}