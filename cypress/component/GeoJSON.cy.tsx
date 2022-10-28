
import React from 'react'

import USA from '../../examples/usa'

/** Matches default cypress canvas size */
const MAP_HEIGHT = '500px'
/** Matches number of tiles loaded in leaflet map which is MAP_HEIGHT in height */
const NUMBER_OF_TILES = 9
/** How long to wait for tiles to load */
const TILE_TIMEOUT = 60000

describe('GeoJSON.cy.ts', () => {
  it('prestine snapshot matches', () => {
    cy.mount(<USA mapHeight={MAP_HEIGHT} />)
    cy.waitForImages('.leaflet-tile-loaded', { length: NUMBER_OF_TILES, timeout: TILE_TIMEOUT })
    cy.compareSnapshot('prestine')
  })

  it('changing z-position works', () => {
    cy.mount(<USA mapHeight={MAP_HEIGHT} />)
      .then((mounted) => {
        mounted.rerender(<USA mapHeight={MAP_HEIGHT} zPosition='middle' />)
        cy.waitForImages('.leaflet-tile-loaded', { length: NUMBER_OF_TILES, timeout: TILE_TIMEOUT })
        cy.compareSnapshot('zposition-change')
      })
  })

  it('hiding a layer works', () => {
    cy.mount(<USA mapHeight={MAP_HEIGHT} />)
      .then((mounted) => {
        mounted.rerender(<USA mapHeight={MAP_HEIGHT} isVisible={false} />)
        cy.waitForImages('.leaflet-tile-loaded', { length: NUMBER_OF_TILES, timeout: TILE_TIMEOUT })
        cy.compareSnapshot('isvisible-change')
      })
  })

  it('after switching z-position while layer is invisible, changing back to visible should maintain correct z-position', () => {
    cy.mount(<USA mapHeight={MAP_HEIGHT} />)
      .then((mounted) => {
        mounted.rerender(<USA mapHeight={MAP_HEIGHT} zPosition='middle' isVisible={true} />)
        cy.waitForImages('.leaflet-tile-loaded', { length: NUMBER_OF_TILES, timeout: TILE_TIMEOUT })
        cy.compareSnapshot('zposition-change-while-invisible')
      })
  })
})
