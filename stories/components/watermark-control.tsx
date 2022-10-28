import React from 'react'
import L from 'leaflet'

import { JSXRenderer, LeafletExtensions } from '../../lib/catalog'

export type WatermarkControlParams = { controlImageWidth: number } & L.ControlOptions

export class WatermarkControl extends L.Control implements LeafletExtensions.Statefull<{ lastW: number }> {
  controlImageWidth: number
  private _renderer: JSXRenderer

  // if you've provided a jsxRenderer to options, then it'll be passed down here as params.jsxRenderer so you can use it to build jsx content
  constructor ({ controlImageWidth, jsxRenderer, ...options }: LeafletExtensions.Updatable<WatermarkControlParams>) {
    super(options)
    this.controlImageWidth = controlImageWidth
    this._renderer = jsxRenderer!
  }

  getState () {
    return { lastW: this.controlImageWidth }
  }

  setState (state: { lastW: number }): void {
    console.log(`WatermarkControl state is set to ${state.lastW}`)
  }

  onAdd (map: L.Map) {
    const container = L.DomUtil.create('div')

    this._renderer(
      <span
      id="watermarkControl"
      style={{
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: '0.5rem',
        padding: '0.5rem',
        display: 'block'
      }}>
        <img style={{
          width: `${this.controlImageWidth}px`,
          display: 'block'
        }} src='https://leafletjs.com/docs/images/logo.png' />
        This is a watermark
      </span>,
      container
    )

    return container
  }

  onRemove (map: L.Map) {
    // Nothing to do here
  }
}
