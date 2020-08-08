describe('Details', () => {
  beforeEach(() => {
    cy.viewport('macbook-15')
  })

  it('shows 404 page for unknown url', () => {
    cy.visit('/some-unknown-url')

    cy.getcy('page404__root').should('be.visible')
  })

  it('links back to dashboard', () => {
    cy.server({
      force404: true
    })

    cy.route({
      url: '**/example/apidemo.json',
      response: 'fixture:success',
      status: 200
    }).as('getApiDemo')

    cy.visit('/some-unknown-url')

    cy.getcy('page404__dashboard-link').should('be.visible').click()
    cy.wait('@getApiDemo')
    cy.getcy('dashboard__root').should('be.visible')
  })
})
