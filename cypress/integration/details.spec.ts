describe('Details', () => {
  beforeEach(() => {
    cy.viewport('macbook-15')
    cy.server({
      force404: true
    })
  })

  it('entiry point from dashboard', () => {
    cy.route({
      url: '**/example/apidemo.json',
      response: 'fixture:success',
      status: 200
    }).as('getApiDemo')

    cy.route({
      url: '**/example/apidemo.json?id=52efc552b6679cfe6ede406c',
      response: 'fixture:success',
      status: 200,
      delay: 100
    }).as('getApiDemoById')

    cy.visit('/')

    cy.wait('@getApiDemo')

    cy.getcy('dashboard__root').should('be.visible')
    cy.getcy('feedback-table__item').first().click()

    cy.getcy('details__skeleton').should('be.visible')
    cy.wait('@getApiDemoById')
    cy.getcy('details__root').should('be.visible')
  })

  it('entiry point to dashboard', () => {
    cy.route({
      url: '**/example/apidemo.json?id=52efc552b6679cfe6ede406c',
      response: 'fixture:success',
      status: 200
    }).as('getApiDemoById')

    cy.route({
      url: '**/example/apidemo.json',
      response: 'fixture:success',
      status: 200,
      delay: 100
    }).as('getApiDemo')

    cy.visit('/details/52efc552b6679cfe6ede406c')

    cy.getcy('details__skeleton').should('be.visible')
    cy.wait('@getApiDemoById')
    cy.getcy('details__root').should('be.visible')

    cy.getcy('details__link-dashboard').should('be.visible').click()
    cy.wait('@getApiDemo')
    cy.getcy('dashboard__root').should('be.visible')
  })

  it('shows decode error when data is wrong', () => {
    cy.route({
      url: '**/example/apidemo.json?id=52ef8e7dfa8d1b5846de176e',
      response: 'fixture:success',
      status: 200
    }).as('getApiDemoById')

    cy.visit('/details/52ef8e7dfa8d1b5846de176e')

    cy.wait('@getApiDemoById')
    cy.contains('You are facing an unexpected Response Body Error!').should(
      'be.visible'
    )
  })

  it('retries fetching when timeout', () => {
    cy.route({
      url: '**/example/apidemo.json?id=52efc552b6679cfe6ede406c',
      response: 'fixture:success',
      status: 200,
      delay: 2000
    }).as('getApiDemoByIdSlow')

    cy.visit('/details/52efc552b6679cfe6ede406c')

    cy.wait('@getApiDemoByIdSlow')
    cy.contains('timeout of 1000ms exceeded').should('be.visible')

    cy.route({
      url: '**/example/apidemo.json?id=52efc552b6679cfe6ede406c',
      response: 'fixture:success',
      status: 200,
      delay: 100
    }).as('getApiDemoByIdFast')

    cy.getcy('http__retry').click()
    cy.getcy('details__skeleton').should('be.visible')
    cy.wait('@getApiDemoByIdFast')
    cy.getcy('details__root').should('be.visible')
  })
})
