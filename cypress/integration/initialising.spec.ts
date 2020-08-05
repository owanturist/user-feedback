describe('CRA', () => {
  it('should show loading skeleton', () => {
    cy.server()

    cy.route({
      method: 'GET',
      url: '**/example/apidemo.json',
      response: 'fixture:success',
      status: 200
    })

    cy.visit('/')

    cy.getcy('dashboard__skeleton').should('be.visible')
  })

  context('failure', () => {
    it('shows bad status 500 error screen', () => {
      cy.server()

      cy.route({
        method: 'GET',
        url: '**/example/apidemo.json',
        response: 'fixture:success',
        status: 500
      }).as('getApiDemoSlow')

      cy.visit('/')

      cy.wait('@getApiDemoSlow')

      cy.contains('You are facing an unexpected Server side Error 500!').should(
        'be.visible'
      )
    })

    it('shows bad status 400 error screen', () => {
      cy.server()

      cy.route({
        method: 'GET',
        url: '**/example/apidemo.json',
        response: 'fixture:success',
        status: 400
      }).as('getApiDemoSlow')

      cy.visit('/')

      cy.wait('@getApiDemoSlow')

      cy.contains('You are facing an unexpected Client side Error 400!').should(
        'be.visible'
      )
    })

    it('shows timeout error screen', () => {
      cy.server()

      cy.route({
        method: 'GET',
        url: '**/example/apidemo.json',
        response: 'fixture:success',
        status: 200,
        delay: 6000
      }).as('getApiDemoSlow')

      cy.visit('/')

      cy.wait('@getApiDemoSlow')

      cy.contains('You are facing a Timeout issue').should('be.visible')

      cy.route({
        method: 'GET',
        url: '**/example/apidemo.json',
        response: 'fixture:success',
        status: 200,
        delay: 100
      }).as('getApiDemoFast')

      cy.getcy('app__retry').click()

      cy.getcy('dashboard__skeleton').should('be.visible')

      cy.wait('@getApiDemoFast')

      cy.getcy('dashboard__root').should('be.visible')
    })
  })
})
