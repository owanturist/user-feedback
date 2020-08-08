describe('Details', () => {
  beforeEach(() => {
    cy.viewport('macbook-15')
    cy.server({
      force404: true
    })
  })

  it('shows 404 page for unknown url', () => {
    cy.visit('/some-unknown-url')

    cy.getcy('page404__root').should('be.visible')
  })

  it('shows 404 page when feedback item not found', () => {
    cy.route({
      url: '**/example/apidemo.json?id=some-unknown-id',
      response: 'fixture:success',
      status: 200
    }).as('getApiDemoById')

    cy.visit('/details/some-unknown-id')

    cy.wait('@getApiDemoById')
    cy.getcy('page404__root').should('be.visible')
  })

  it('links back to dashboard', () => {
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
