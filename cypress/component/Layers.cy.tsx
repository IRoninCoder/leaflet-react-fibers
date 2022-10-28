import React from 'react'
import ReactDOM from 'react-dom'

import './Layers.css'
import { CustomMapOptions } from '../../lib/catalog'
import { LeafletMap, L } from '../../lib'

const mapOpts: CustomMapOptions = {
  minZoom: 10,
  maxZoom: 20,
  zoom: 1,
  maxBoundsViscosity: 1,
  crs: L.CRS.Simple
}
const IMAGE_URL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Hummingbird.jpg/800px-Hummingbird.jpg?20051004190252'
const VIDEO_URL = 'https://www.mapbox.com/bites/00188/patricia_nasa.webm'

const Layers = () => {
  return (
    <LeafletMap options={mapOpts} jsxRenderer={ReactDOM.render}>

      {/* Just a nice image */}
      <lfImage bounds={[[0, -0.14], [-0.2, 0.14]]}
        imageUrl={IMAGE_URL}
        options={{
          attribution: '<a href="https://commons.wikimedia.org/wiki/Commons:Creative_Commons_Attribution-ShareAlike_3.0_Unported_License">Creative Commons</a>'
        }}
      />

      {/* Popup as layer */}
      <lfPopup latlng={[0, 0]}>
        <>Hurracian Patricia Video / Costa&apos;s hummingbird (Calypte costae) </>
      </lfPopup>

      {/* A grid */}
      <lfGridLayer options={{ className: 'grid-border', opacity: 1, tileSize: 128 }} />

      {/* A video layer */}
      <lfVideo video={VIDEO_URL} bounds={[[0.2, -0.14], [0, 0.14]]} />

    </LeafletMap>
  )
}

describe('layers.cy.ts', () => {
  it('prestine snapshot matches', () => {
    cy.mount(<Layers />)
    cy.get('video', { timeout: 60000 })
      .then({ timeout: 60000 }, (vid$) => {
        return new Promise<void>((resolve) => {
          // Pause video before screenshot
          vid$.on('play', () => {
            vid$[0].pause()
            resolve()
          })
        })
      })
    cy.waitForImages('div.leaflet-pane.leaflet-overlay-pane > img')
    cy.compareSnapshot('prestine')
  })
})
