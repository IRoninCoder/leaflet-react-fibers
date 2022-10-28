import L from 'leaflet'

import { JSXRenderer, LeafletExtensions } from '../../lib/catalog'

// extends the default tile layer with a new sub-type
export type CustomTileLayerProps = { options?: L.TileLayerOptions }

export class CustomTileLayer extends L.TileLayer {
  private _renderer: JSXRenderer

  constructor (params: LeafletExtensions.Updatable<CustomTileLayerProps>) {
    super('', params.options)
    this._renderer = params.jsxRenderer!
  }

  getTileUrl (coords: L.Coords) {
    return `https://tile.openstreetmap.org/${coords.z}/${coords.x}/${coords.y}.png`
  }

  getAttribution () {
    return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
}
