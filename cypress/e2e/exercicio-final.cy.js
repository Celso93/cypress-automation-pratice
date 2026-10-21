import * as cadastro from '../module/cadastro/index.js'
import * as login from '../module/login/index.js'

const senhaCorreta = '123456'

describe('Exercício de Automação - Cenários 8,9,10,15 e 16', () => {

  let emailAleatorio;

  beforeEach(() => {
    emailAleatorio = `john.doe.${Date.now()}@example.com`
  })

  context('Test Case 1: Register User', () => {
    beforeEach(() => {
      cy.visit('/')
      cadastro.cadastroNovoUsuario(emailAleatorio)
      cy.get('a[href="/logout"]').click()
    })

    afterEach(() => {
      cy.get('a[href="/delete_account"]').click()
      cy.deletarConta()
    })

    it.skip('Test Case 8: Verify All Products and product detail page', () => {
      /*
      1. Launch browser
      2. Navigate to url 'http://automationexercise.com'
      3. Verify that home page is visible successfully
      4. Click on 'Products' button
      5. Verify user is navigated to ALL PRODUCTS page successfully
      6. The products list is visible
      7. Click on 'View Product' of first product
      8. User is landed to product detail page
      9. Verify that detail detail is visible: product name, category, price, availability, condition, brand
      */
    })

    it.skip('Test Case 9: Search Product', () => {
      /*
      1. Launch browser
      2. Navigate to url 'http://automationexercise.com'
      3. Verify that home page is visible successfully
      4. Click on 'Products' button
      5. Verify user is navigated to ALL PRODUCTS page successfully
      6. Enter product name in search input and click search button
      7. Verify 'SEARCHED PRODUCTS' is visible
      8. Verify all the products related to search are visible
      */
    })

    it.skip('Test Case 10: Verify Subscription in home page', () => {
      /*1. Launch browser
      2. Navigate to url 'http://automationexercise.com'
      3. Verify that home page is visible successfully
      4. Scroll down to footer
      5. Verify text 'SUBSCRIPTION'
      6. Enter email address in input and click arrow button
      7. Verify success message 'You have been successfully subscribed!' is visibleF
    */
    })

    it.skip('Test Case 15: Place Order: Register before Checkout', () => {
      /*
      1. Launch browser
      2. Navigate to url 'http://automationexercise.com'
      3. Verify that home page is visible successfully
      4. Click 'Signup / Login' button
      5. Fill all details in Signup and create account
      6. Verify 'ACCOUNT CREATED!' and click 'Continue' button
      7. Verify ' Logged in as username' at top
      8. Add products to cart
      9. Click 'Cart' button
      10. Verify that cart page is displayed
      11. Click Proceed To Checkout
      12. Verify Address Details and Review Your Order
      13. Enter description in comment text area and click 'Place Order'
      14. Enter payment details: Name on Card, Card Number, CVC, Expiration date
      15. Click 'Pay and Confirm Order' button
      16. Verify success message 'Your order has been placed successfully!'
      17. Click 'Delete Account' button
      18. Verify 'ACCOUNT DELETED!' and click 'Continue' button
      */
    })


    it.skip('Test Case 16: Place Order: Login before Checkout', () => {
      /*
      1. Launch browser
      2. Navigate to url 'http://automationexercise.com'
      3. Verify that home page is visible successfully
      4. Click 'Signup / Login' button
      5. Fill email, password and click 'Login' button
      6. Verify 'Logged in as username' at top
      7. Add products to cart
      8. Click 'Cart' button
      9. Verify that cart page is displayed
      10. Click Proceed To Checkout
      11. Verify Address Details and Review Your Order
      12. Enter description in comment text area and click 'Place Order'
      13. Enter payment details: Name on Card, Card Number, CVC, Expiration date
      14. Click 'Pay and Confirm Order' button
      15. Verify success message 'Your order has been placed successfully!'
      16. Click 'Delete Account' button
      17. Verify 'ACCOUNT DELETED!' and click 'Continue' button
      */
    })
  })
})
