
import React from 'react'

import USA from '../../examples/usa'

describe('GeoJSON.cy.ts', () => {
  it('prestine snapshot matches', () => {
    cy.mount(<USA />)
    cy.compareSnapshot('GeoJSON')
  })

  it('changing z-position works', () => {
    cy.mount(<USA />)
      .then((mounted) => {
        mounted.rerender(<USA zPosition='middle' />)
        cy.compareSnapshot('GeoJSON-zposition')
      })
  })

  it('hiding a layer works', () => {
    cy.mount(<USA />)
      .then((mounted) => {
        mounted.rerender(<USA isVisible={false} />)
        cy.compareSnapshot('GeoJSON-isvisible')
      })
  })

  it.only('after switching z-position while layer is invisible, changing back to visible should maintain correct z-position', () => {
    cy.mount(<USA />)
      .then((mounted) => {
        mounted.rerender(<USA zPosition='middle' isVisible={true} />)
        cy.compareSnapshot('GeoJSON-correctzposition')
      })
  })
})
