/*
Com XPath, os seletores ficaram mais longos e menos legíveis que em CSS, por causa da sintaxe com //, @, colchetes e aspas aninhadas (ex.: .navbar-nav virou //ul[contains(@class,'navbar-nav')]). 
Na performance, a diferença foi pequena (1min18s com XPath contra 1min14s com CSS), então prefiro CSS com atributos data-qa, como recomenda a documentação do Cypress.
*/

describe('Exercício - Automation Exercise Xpath', () => {

  let emailAleatorio;

  beforeEach(() => {
    cy.visit('https://www.automationexercise.com/')
    cy.xpath("//div[contains(@class,'features_items')]").should('be.visible')
    emailAleatorio = `john.doe.${Date.now()}@example.com`
  })


  it('Cadastrar um novo usuário com sucesso', () => {
    cy.xpath("//a[@href='/login']").click()
    cy.xpath("//h2[contains(text(),'New User Signup!')]").should('be.visible')

    cy.xpath("//input[@data-qa='signup-name']").type('John Doe')
    cy.xpath("//input[@data-qa='signup-email']").type(emailAleatorio)
    cy.xpath("//button[@data-qa='signup-button']").click()
    cy.xpath("//h2[contains(.,'Enter Account Information')]").should('be.visible')

    cy.xpath("//input[@id='id_gender1']").click()
    cy.xpath("//input[@data-qa='password']").type('123456')
    cy.xpath("//select[@data-qa='days']").select('10')
    cy.xpath("//select[@data-qa='months']").select('May')
    cy.xpath("//select[@data-qa='years']").select('1995')

    cy.xpath("//input[@id='newsletter']").click()
    cy.xpath("//input[@id='optin']").click()

    cy.xpath("//input[@data-qa='first_name']").type('John')
    cy.xpath("//input[@data-qa='last_name']").type('Doe')
    cy.xpath("//input[@data-qa='company']").type('Empresa Teste')

    cy.xpath("//input[@data-qa='address']").type('123 Main St')
    cy.xpath("//input[@data-qa='address2']").type('Apto 4')
    cy.xpath("//select[@data-qa='country']").select('United States')
    cy.xpath("//input[@data-qa='state']").type('California')
    cy.xpath("//input[@data-qa='city']").type('Los Angeles')
    cy.xpath("//input[@data-qa='zipcode']").type('90001')
    cy.xpath("//input[@data-qa='mobile_number']").type('+1 123 456 7890')

    cy.xpath("//button[@data-qa='create-account']").click()

    cy.xpath("//*[@data-qa='account-created']").should('be.visible').and('contain', 'Account Created!')
    cy.xpath("//*[@data-qa='continue-button']").click()

    cy.xpath("//ul[contains(@class,'navbar-nav')]").should('contain.text', 'Logged in as John Doe')
    cy.xpath("//a[@href='/delete_account']").click()
    cy.xpath("//*[@data-qa='account-deleted']").should('be.visible').and('contain', 'Account Deleted!')
    cy.xpath("//*[@data-qa='continue-button']").click()
  })

  it('Login com email e senha corretos', () => {
    cy.xpath("//a[@href='/login']").click()
    cy.xpath("//h2[contains(text(),'New User Signup!')]").should('be.visible')

    cy.xpath("//input[@data-qa='signup-name']").type('John Doe')
    cy.xpath("//input[@data-qa='signup-email']").type(emailAleatorio)
    cy.xpath("//button[@data-qa='signup-button']").click()
    cy.xpath("//h2[contains(.,'Enter Account Information')]").should('be.visible')

    cy.xpath("//input[@id='id_gender1']").click()
    cy.xpath("//input[@data-qa='password']").type('123456')
    cy.xpath("//select[@data-qa='days']").select('10')
    cy.xpath("//select[@data-qa='months']").select('May')
    cy.xpath("//select[@data-qa='years']").select('1995')

    cy.xpath("//input[@id='newsletter']").click()
    cy.xpath("//input[@id='optin']").click()

    cy.xpath("//input[@data-qa='first_name']").type('John')
    cy.xpath("//input[@data-qa='last_name']").type('Doe')
    cy.xpath("//input[@data-qa='company']").type('Empresa Teste')

    cy.xpath("//input[@data-qa='address']").type('123 Main St')
    cy.xpath("//input[@data-qa='address2']").type('Apto 4')
    cy.xpath("//select[@data-qa='country']").select('United States')
    cy.xpath("//input[@data-qa='state']").type('California')
    cy.xpath("//input[@data-qa='city']").type('Los Angeles')
    cy.xpath("//input[@data-qa='zipcode']").type('90001')
    cy.xpath("//input[@data-qa='mobile_number']").type('+1 123 456 7890')

    cy.xpath("//button[@data-qa='create-account']").click()

    cy.xpath("//*[@data-qa='account-created']").should('be.visible').and('contain', 'Account Created!')
    cy.xpath("//*[@data-qa='continue-button']").click()

    cy.xpath("//a[@href='/logout']").should('be.visible').click()

    cy.intercept('POST', '**/login').as('requisicaoLogin')
    cy.xpath("//input[@data-qa='login-email']").clear().type(emailAleatorio)
    cy.xpath("//input[@data-qa='login-password']").clear().type('123456')
    cy.xpath("//button[@data-qa='login-button']").click()

    cy.wait('@requisicaoLogin').its('request.body').then((corpo) => {
      const parametros = new URLSearchParams(corpo)
      expect(parametros.get('email')).to.eq(emailAleatorio)
    })
    cy.xpath("//ul[contains(@class,'navbar-nav')]").should('contain.text', 'Logged in as John Doe')

    cy.xpath("//a[@href='/delete_account']").click()
    cy.xpath("//*[@data-qa='account-deleted']").should('be.visible').and('contain', 'Account Deleted!')
    cy.xpath("//*[@data-qa='continue-button']").click()
  })

  it('Login com email e senha incorretos', () => {
    cy.xpath("//a[@href='/login']").click()

    cy.intercept('POST', '**/login').as('requisicaoLogin')
    cy.xpath("//input[@data-qa='login-email']").clear().type('email.invalido@example.com')
    cy.xpath("//input[@data-qa='login-password']").clear().type('senhaErrada123')
    cy.xpath("//button[@data-qa='login-button']").click()

    cy.wait('@requisicaoLogin').its('request.body').then((corpo) => {
      const parametros = new URLSearchParams(corpo)
      expect(parametros.get('email')).to.eq('email.invalido@example.com')
      expect(parametros.get('password')).to.eq('senhaErrada123')
    })
    cy.url().should('include', '/login')
    cy.xpath("//*[contains(text(),'Your email or password is incorrect!')]").should('be.visible')
  })

  it('Logout de usuário', () => {
    cy.xpath("//a[@href='/login']").click()
    cy.xpath("//h2[contains(text(),'New User Signup!')]").should('be.visible')

    cy.xpath("//input[@data-qa='signup-name']").type('John Doe')
    cy.xpath("//input[@data-qa='signup-email']").type(emailAleatorio)
    cy.xpath("//button[@data-qa='signup-button']").click()
    cy.xpath("//h2[contains(.,'Enter Account Information')]").should('be.visible')

    cy.xpath("//input[@id='id_gender1']").click()
    cy.xpath("//input[@data-qa='password']").type('123456')
    cy.xpath("//select[@data-qa='days']").select('10')
    cy.xpath("//select[@data-qa='months']").select('May')
    cy.xpath("//select[@data-qa='years']").select('1995')

    cy.xpath("//input[@id='newsletter']").click()
    cy.xpath("//input[@id='optin']").click()

    cy.xpath("//input[@data-qa='first_name']").type('John')
    cy.xpath("//input[@data-qa='last_name']").type('Doe')
    cy.xpath("//input[@data-qa='company']").type('Empresa Teste')

    cy.xpath("//input[@data-qa='address']").type('123 Main St')
    cy.xpath("//input[@data-qa='address2']").type('Apto 4')
    cy.xpath("//select[@data-qa='country']").select('United States')
    cy.xpath("//input[@data-qa='state']").type('California')
    cy.xpath("//input[@data-qa='city']").type('Los Angeles')
    cy.xpath("//input[@data-qa='zipcode']").type('90001')
    cy.xpath("//input[@data-qa='mobile_number']").type('+1 123 456 7890')

    cy.xpath("//button[@data-qa='create-account']").click()

    cy.xpath("//*[@data-qa='account-created']").should('be.visible').and('contain', 'Account Created!')
    cy.xpath("//*[@data-qa='continue-button']").click()

    cy.xpath("//a[@href='/logout']").click()
    cy.url().should('include', '/login')
  })

  it('Cadastro de usuário com email já existente', () => {
    cy.xpath("//a[@href='/login']").click()
    cy.xpath("//h2[contains(text(),'New User Signup!')]").should('be.visible')

    cy.xpath("//input[@data-qa='signup-name']").type('John Doe')
    cy.xpath("//input[@data-qa='signup-email']").type(emailAleatorio)
    cy.xpath("//button[@data-qa='signup-button']").click()
    cy.xpath("//h2[contains(.,'Enter Account Information')]").should('be.visible')

    cy.xpath("//input[@id='id_gender1']").click()
    cy.xpath("//input[@data-qa='password']").type('123456')
    cy.xpath("//select[@data-qa='days']").select('10')
    cy.xpath("//select[@data-qa='months']").select('May')
    cy.xpath("//select[@data-qa='years']").select('1995')

    cy.xpath("//input[@id='newsletter']").click()
    cy.xpath("//input[@id='optin']").click()

    cy.xpath("//input[@data-qa='first_name']").type('John')
    cy.xpath("//input[@data-qa='last_name']").type('Doe')
    cy.xpath("//input[@data-qa='company']").type('Empresa Teste')

    cy.xpath("//input[@data-qa='address']").type('123 Main St')
    cy.xpath("//input[@data-qa='address2']").type('Apto 4')
    cy.xpath("//select[@data-qa='country']").select('United States')
    cy.xpath("//input[@data-qa='state']").type('California')
    cy.xpath("//input[@data-qa='city']").type('Los Angeles')
    cy.xpath("//input[@data-qa='zipcode']").type('90001')
    cy.xpath("//input[@data-qa='mobile_number']").type('+1 123 456 7890')

    cy.xpath("//button[@data-qa='create-account']").click()

    cy.xpath("//*[@data-qa='account-created']").should('be.visible').and('contain', 'Account Created!')
    cy.xpath("//*[@data-qa='continue-button']").click()

    cy.xpath("//a[@href='/logout']").click()

    cy.xpath("//input[@data-qa='signup-name']").type('John Doe')
    cy.xpath("//input[@data-qa='signup-email']").type(emailAleatorio)
    cy.xpath("//button[@data-qa='signup-button']").click()
    cy.xpath("//*[contains(text(),'Email Address already exist!')]").should('be.visible')
  })
})
