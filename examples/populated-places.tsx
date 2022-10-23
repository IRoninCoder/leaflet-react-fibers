import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

import { LeafletMap, IntrinsicMapChildren } from '../lib'
// data from https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_populated_places.geojson
import PopulatedGeoJson from './assets/populated-places.geo.json'

/** Take a geoJson and return lfMarker layers */
const getMarkers = (geoJson: Record<string, any>) => {
  const markers: IntrinsicMapChildren['children'] = []

  for (const feature of geoJson.features) {
    markers.push(
      // Leaflet uses [y, x] instead of [x, y]
      <lfCircleMarker key={`${feature.geometry.coordinates[1]}-${feature.geometry.coordinates[0]}`} latlng={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]} options={{ color: 'red', weight: 0.8 }}>
        <lfTooltip options={{ direction: 'top' }}>
          <>{feature.properties.NAME}, {feature.properties.SOV0NAME}</>
        </lfTooltip>
      </lfCircleMarker>
    )
  }

  return markers
}

export interface PopulatedPlacesProps {
  geoJson: any
}
export const PopulatedPlacesPropsDefaults: PopulatedPlacesProps = {
  geoJson: PopulatedGeoJson
}
const PopulatedPlaces = ({ geoJson }: Partial<PopulatedPlacesProps> = PopulatedPlacesPropsDefaults) => {
  const [markers, setMarkers] = useState<IntrinsicMapChildren['children']>([])

  useEffect(() => {
    setMarkers(getMarkers(geoJson))
  }, [geoJson])

  return (
    <div style={{ height: 500 }}>
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

        <lfTilesWMS baseUrl="http://ows.mundialis.de/services/service?" options={{
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
