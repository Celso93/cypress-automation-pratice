// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })

Cypress.Commands.add('cadastroNovoUsuario', (email) => {
    cy.get('a[href="/login"]').click()
    cy.contains('h2', 'New User Signup!').should('be.visible')

    cy.get('input[data-qa=signup-name]').type('John Doe')
    cy.get('input[data-qa=signup-email]').type(email)
    cy.get('button[data-qa=signup-button]').click()

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
})
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })