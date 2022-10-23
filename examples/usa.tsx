import React from 'react'
import ReactDOM from 'react-dom'

import { LeafletMap, L, MapContext } from '../lib'
// data from https://github.com/johan/world.geo.json/tree/master/countries/USA
import StatesGeoJson from './assets/states.geo.json'

/** Adjust location of state labels */
const STATE_LABEL_ADJUSTMENTS: Record<string, { offset: L.PointExpression }> = {
  CA: { offset: [0, -1] },
  CT: { offset: [0.18, 0] },
  DE: { offset: [-0.4, 0] },
  ID: { offset: [-1, -1] },
  FL: { offset: [0.6, 2.2] },
  IL: { offset: [0.5, 0.5] },
  KY: { offset: [0, 1] },
  LA: { offset: [0, -1] },
  MA: { offset: [0.18, 0] },
  MD: { offset: [0.5, 0.5] },
  MI: { offset: [-2, 2] },
  MN: { offset: [0, -1] },
  NC: { offset: [0.5, 1] },
  NH: { offset: [-0.5, 0] },
  NJ: { offset: [0, 0.3] },
  NV: { offset: [1, 0] },
  OK: { offset: [0, 1] },
  OR: { offset: [0, 0] },
  RI: { offset: [0, -0.08] },
  SC: { offset: [0.3, 0] },
  TX: { offset: [0.8, 0.5] },
  VA: { offset: [0, 1] },
  VT: { offset: [0.5, -0.18] },
  WA: { offset: [0, 0] },
  WV: { offset: [0, -0.6] }
}

/** Adds state abbr. labels */
const addStateLabel = (map: L.Map, feature: any, layer: L.Layer & { getBounds: () => L.LatLngBounds }) => {
  const stateId = feature.id?.toString().replace('USA-', '')

  if (stateId) {
    const mapZoomHandler = () => {
      const zoom = map.getZoom()

      // Following conditions resize the label font for each particular state
      if (zoom < 5 && ~['NH', 'VT', 'MA', 'CT'].indexOf(stateId)) {
        marker.getElement()!.style.display = 'none'
      } else if (zoom < 6 && ~['RI', 'MD', 'NJ', 'DE'].indexOf(stateId)) {
        marker.getElement()!.style.display = 'none'
      } else if (zoom < 8 && ~['DC'].indexOf(stateId)) {
        marker.getElement()!.style.display = 'none'
      } else {
        marker.getElement()!.style.display = 'block'
      }
    }

    let latLng = layer.getBounds().getCenter()

    // Apply adjustments, if any
    if (Object.prototype.hasOwnProperty.call(STATE_LABEL_ADJUSTMENTS, stateId)) {
      const adjustments = STATE_LABEL_ADJUSTMENTS[stateId]
      const offset: any = adjustments.offset

      latLng = L.latLng(latLng.lat + offset[0], latLng.lng + offset[1])
    }

    const marker = L.marker(latLng, {
      interactive: false,
      icon: L.divIcon({
        className: 'label',
        html: `<span style="color: white; font-weight: bold; text-shadow: 0.125rem 0.125rem 0.125rem black">${stateId}</span>`,
        iconSize: [16, 16]
      })
    }).addTo(map)

    // Setup event handlers
    map.on('zoom', mapZoomHandler)
    layer.once('remove', () => {
      map.off('zoom', mapZoomHandler)
      marker.remove()
    })

    // Sync current zoom with style
    mapZoomHandler()
  }
}

/** Extended wyoming map for demonstration purposes */
const WyomingExtended = ({ color }: { color: string }) => {
  return (
    <>
      <lfRectangle bounds={[[45.002073, -111.05254], [39.998429, -104.053011]]} options={{ fillColor: color, fillOpacity: 0.9, weight: 0.8 }}>
        <lfTooltip options={{ direction: 'top', offset: [0, -50] }}>
          <div>Imaginary variation of Wyoming</div>
        </lfTooltip>
      </lfRectangle>
      <lfMarker latlng={[43, -109.3]} options={{ icon: L.divIcon({ className: 'to-remove-default-class', html: '<span style="white-space: nowrap; pointer-events: none;">WY - EXT</span>' }) }}></lfMarker>
    </>
  )
}

export interface USAProps {
  isVisible: boolean
  zPosition: 'top' | 'middle' | 'bottom'
  geoJson: any
  mutability: boolean
  wyomingColor: string
}
export const USAPropsDefaults: USAProps = {
  zPosition: 'bottom',
  isVisible: true,
  mutability: true,
  wyomingColor: 'white',
  geoJson: StatesGeoJson
}
/** Map of us states using geo json boundaries */
const USA = (props: Partial<USAProps> = USAPropsDefaults) => {
  const { isVisible, zPosition, geoJson, mutability, wyomingColor } = { ...USAPropsDefaults, ...props }

  return (
    <div style={{ height: 600 }}>
      <LeafletMap
        jsxRenderer={ReactDOM.render}
        options={{
          minZoom: 4,
          maxZoom: 10,
          zoom: 4,
          maxBoundsViscosity: 1,
          // center somewhere above Kansas
          center: [38.258584, -91.4242773]
        }}
      >

        {/* <lfImage bounds={[[49.3, -127], [23, -65]]} imageUrl='https://tbh.com/app/uploads/2018/02/iStock-538151722.jpg'></lfImage> */}

        <lfTilesWMS baseUrl="http://ows.mundialis.de/services/service?" options={{
          layers: 'TOPO-WMS',
          format: 'image/png',
          noWrap: true,
          transparent: true,
          opacity: 0.7,
          attribution: 'Weather data © 2012 IEM Nexrad'
        }} />

        {/* TODO: BUG changing mutability duplicates all layers. Other properties do not have this effect */}
        <MapContext.Consumer>
          {({ map }) => map && (
            <lfGeoJSON
              mutable={mutability}
              geojson={geoJson}
              options={{
                interactive: false,
                onEachFeature: (feature, layer: L.Layer & { getBounds: () => L.LatLngBounds }) => addStateLabel(map, feature, layer),
                style: {
                  fillOpacity: 0,
                  weight: 1
                }
              }}
            />
          )}
        </MapContext.Consumer>

        <lfLayerGroup mutable={mutability}>

          {/* wyoming extended onto colorado and utah */}
          {isVisible && zPosition === 'bottom' && <WyomingExtended color={wyomingColor} />}

          {/* colorado */}
          <lfRectangle bounds={[[41.003906, -109.058934], [36.994786, -102.053927]]} options={{ fillColor: 'red', fillOpacity: 0.8, weight: 0.8, interactive: false }}></lfRectangle>
          <lfMarker latlng={[39, -105.8]} options={{ icon: L.divIcon({ className: 'to-remove-default-class', html: '<span style="color: white;">CO</span>' }) }}></lfMarker>

          {/* wyoming extended onto colorado and utah */}
          {isVisible && zPosition === 'middle' && <WyomingExtended color={wyomingColor} />}

          {/* utah */}
          <lfRectangle bounds={[[42.000709, -114.048427], [37.000263, -109.042503]]} options={{ fillColor: 'orange', fillOpacity: 0.8, weight: 0.8, interactive: false }}></lfRectangle>
          <lfMarker latlng={[39, -111.8]} options={{ icon: L.divIcon({ className: 'to-remove-default-class', html: 'UT' }) }}></lfMarker>

          {/* wyoming extended onto colorado and utah */}
          {isVisible && zPosition === 'top' && <WyomingExtended color={wyomingColor} />}

        </lfLayerGroup>

      </LeafletMap>
    </div>
  )
}

export default USA
