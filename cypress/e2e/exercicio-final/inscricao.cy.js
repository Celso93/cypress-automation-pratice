import * as inscricao from '../../module/inscricao/index.js'

describe('Exercício final - Inscrição', { tags: '@exercicio-final' }, () => {

  beforeEach(() => {
    cy.visit('/')
  })

  it('Test Case 10: Verify Subscription in home page', () => {
    const emailAleatorio = `john.doe.${Date.now()}@example.com`

    inscricao.acessarRodape()
    inscricao.validarSecaoInscricaoVisivel()
    inscricao.realizarInscricao(emailAleatorio)
    inscricao.validarInscricaoComSucesso()
  })
})
