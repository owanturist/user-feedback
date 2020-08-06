describe('Filtering', () => {
  beforeEach(() => {
    cy.viewport('macbook-15')

    cy.server()

    cy.route({
      url: '**/example/apidemo.json',
      response: 'fixture:success',
      status: 200
    }).as('getApiDemo')

    cy.visit('/')

    cy.wait('@getApiDemo')

    cy.getcy('dashboard__root').should('be.visible')
    cy.getcy('feedback-table__item').as('items')
  })

  it('should filter by search via comment', () => {
    cy.get('@items').contains('button doenst work').as('with-button')
    cy.get('@items')
      .contains(
        `This page doesn't have any print styling. The selected area is really all I care about printing, but much more shows up and this seems like it'll be cut off on the right.`
      )
      .as('with-but')
    cy.get('@items').contains(`bouton ne fonctionne pas`).as('with-bouton')

    cy.getcy('filters__search-input').type('but')

    cy.get('@items').should('have.length', 3)
    cy.get('@with-button').should('be.visible')
    cy.get('@with-but').should('be.visible')
    cy.get('@with-bouton').should('be.visible')

    cy.getcy('filters__search-input').type('ton d')

    cy.get('@items').should('have.length', 1)
    cy.get('@with-button').should('be.visible')
    cy.get('@with-but').should('not.exist')
    cy.get('@with-bouton').should('not.exist')
  })

  it('should filter by rating', () => {
    cy.getcy('rating__interactive_1').click()
    cy.get('@items').should('have.length', 21)

    cy.getcy('rating__interactive_2').click()
    cy.get('@items').should('have.length', 17)

    cy.getcy('rating__interactive_3').click()
    cy.get('@items').should('have.length', 11)

    cy.getcy('rating__interactive_4').click()
    cy.get('@items').should('have.length', 3)

    cy.getcy('rating__interactive_5').click()
    cy.get('@items').should('not.exist')

    cy.getcy('rating__interactive_2').click()
    cy.get('@items').should('have.length', 4)
  })
})
