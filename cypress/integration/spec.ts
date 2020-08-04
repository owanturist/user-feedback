describe('CRA', () => {
  it('shows learn link', () => {
    cy.visit('/')

    cy.get('button').contains('+').click().click()
    cy.get('div').contains('2')
  })
})
