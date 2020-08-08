describe('Initialising', () => {
  beforeEach(() => {
    cy.viewport('macbook-15')
    cy.server({
      force404: true
    })
  })

  it('should show loading skeleton', () => {
    cy.route({
      url: '**/example/apidemo.json',
      response: 'fixture:success',
      status: 200
    })

    cy.visit('/')

    cy.getcy('dashboard__skeleton').should('be.visible')
  })

  it('renders feedback correctly', () => {
    cy.route({
      url: '**/example/apidemo.json',
      response: 'fixture:success',
      status: 200
    }).as('getApiDemo')

    cy.visit('/')

    cy.wait('@getApiDemo')

    cy.getcy('dashboard__root').should('be.visible')
    cy.getcy('feedback-table__item').as('items')

    cy.get('@items').should('have.length', 21)
    cy.get('@items').getcy('rating__static_1').should('not.exist')
    cy.get('@items').getcy('rating__static_2').should('have.length', 4)
    cy.get('@items').getcy('rating__static_3').should('have.length', 6)
    cy.get('@items').getcy('rating__static_4').should('have.length', 8)
    cy.get('@items').getcy('rating__static_5').should('have.length', 3)

    cy.get('@items').first().as('first')
    cy.get('@first').contains('belle offre de services')
    cy.get('@first').contains('Chrome')
    cy.get('@first').contains('32.0')
    cy.get('@first').contains('Desktop')
    cy.get('@first').contains('MacOSX')
  })

  context('failure', () => {
    it('shows bad status 500 error screen', () => {
      cy.route({
        url: '**/example/apidemo.json',
        response: 'fixture:success',
        status: 500
      }).as('getApiDemo')

      cy.visit('/')

      cy.wait('@getApiDemo')

      cy.contains('You are facing an unexpected Server side Error 500!').should(
        'be.visible'
      )
    })

    it('shows bad status 400 error screen', () => {
      cy.route({
        url: '**/example/apidemo.json',
        response: 'fixture:success',
        status: 400
      }).as('getApiDemo')

      cy.visit('/')

      cy.wait('@getApiDemo')

      cy.contains('You are facing an unexpected Client side Error 400!').should(
        'be.visible'
      )
    })

    it('shows timeout error screen', () => {
      cy.route({
        url: '**/example/apidemo.json',
        response: 'fixture:success',
        status: 200,
        delay: 6000
      }).as('getApiDemoSlow')

      cy.visit('/')

      cy.wait('@getApiDemoSlow')

      cy.contains('You are facing a Timeout issue').should('be.visible')

      cy.route({
        url: '**/example/apidemo.json',
        response: 'fixture:success',
        status: 200,
        delay: 200
      }).as('getApiDemoFast')

      cy.getcy('http__retry').click()

      cy.getcy('dashboard__skeleton').should('be.visible')

      cy.wait('@getApiDemoFast')

      cy.getcy('dashboard__root').should('be.visible')
    })
  })
})
