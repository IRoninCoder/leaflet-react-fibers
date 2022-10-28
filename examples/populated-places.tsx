import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

import { L, LeafletMap, IntrinsicMapChildren } from '../lib'
// data from https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_populated_places.geojson
import PopulatedGeoJson from './assets/populated-places.geo.json'

/** Custom SVG icon for population makers */
const getPopulationIcon = () => {
  return L.divIcon({
    className: 'to-remove-default-class',
    html: `
    <svg viewBox="0 0 128 128" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle style="fill: black; stroke: white; stroke-width: 1rem;" cx="64" cy="38" r="36" />
      <path
        style="fill: black; stroke: white; stroke-width: 1rem;"
        d="M 128.09373,127.5 H -0.09373474 C -0.09373474,92.102008 28.602008,63.406265 64,63.406265 c 35.39799,3e-6 64.09373,28.695745 64.09373,64.093735 z"
      />
    </svg>`
  })
}

/** Take a geoJson and return lfMarker layers */
const getMarkers = (geoJson: Record<string, any>) => {
  const markers: IntrinsicMapChildren['children'] = []

  for (const feature of geoJson.features) {
    markers.push(
      // Leaflet uses [y, x] instead of [x, y]
      <lfMarker key={`${feature.geometry.coordinates[1]}-${feature.geometry.coordinates[0]}`} latlng={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]} options={{ icon: getPopulationIcon() }}>
        <lfTooltip options={{ direction: 'top' }}>
          <>{feature.properties.NAME}, {feature.properties.SOV0NAME}</>
        </lfTooltip>
      </lfMarker>
    )
  }

  return markers
}

export interface PopulatedPlacesProps {
  geoJson: any
  mapHeight: string
}
export const PopulatedPlacesPropsDefaults: PopulatedPlacesProps = {
  geoJson: PopulatedGeoJson,
  mapHeight: '42rem'
}
const PopulatedPlaces = ({ geoJson, mapHeight }: Partial<PopulatedPlacesProps> = PopulatedPlacesPropsDefaults) => {
  const [markers, setMarkers] = useState<IntrinsicMapChildren['children']>([])

  useEffect(() => {
    setMarkers(getMarkers(geoJson))
  }, [geoJson])

  return (
    <div style={{ height: mapHeight }}>
      <LeafletMap
        jsxRenderer={ReactDOM.render}
        options={{
          minZoom: 1,
          maxZoom: 10,
          zoom: 3,
          maxBoundsViscosity: 1,
          // center somewhere middle of ocean
          center: [39.258584, -41.4242773]
        }}
      >

        <lfTilesWMS baseUrl="https://ows.mundialis.de/services/service?" options={{
          layers: 'TOPO-WMS',
          format: 'image/png',
          noWrap: true,
          transparent: true,
          opacity: 0.7,
          attribution: 'Weather data © 2012 IEM Nexrad'
        }} />

        {markers as any}

      </LeafletMap>
    </div>
  )
}

export default PopulatedPlaces
