describe('template spec', () => {
  it('Cadastrar um novo usuário com sucesso', () => {
    const emailAleatorio = `john.doe.${Date.now()}@example.com`

    cy.visit('https://www.automationexercise.com/')
    cy.get('a[href="/login"]').click()
    cy.get('input[data-qa=signup-name]').type('John Doe')
    cy.get('input[data-qa=signup-email]').type(emailAleatorio)
    cy.get('button[data-qa=signup-button]').click()

    cy.get('#id_gender1').click()
    cy.get('input[data-qa=password]').type('123456')
    cy.get('select[data-qa=days]').select('10')
    cy.get('select[data-qa=months]').select('May')
    cy.get('select[data-qa=years]').select('1995')

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

    // cy.get('button[data-qa=create-account]').click()
  })
})