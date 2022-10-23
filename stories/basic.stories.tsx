import React from 'react'
import ReactDOM from 'react-dom'
import L from 'leaflet'

import './storybook.css'

import LeafletMap from '../lib/map'

const museumIcon = (markerColor: string) => {
  return L.divIcon({
    className: 'to-just-remove-default-class',
    iconSize: [32, 32],
    shadowSize: [0, 0],
    html:
      `<svg viewBox="0 0 243.176 243.176" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">
        <path fill="${markerColor}" d="m 229.24891,165.28097 v -9.636 c 0,-8.779 -6.92,-15.953 -15.59,-16.404 V 60.667969 h 9.59 c 3.313,0 6,-2.686 6,-6 v -25.804 c 0,-2.817 -1.96,-5.255 -4.711,-5.86 L 122.75191,0.61596875 c -0.85,-0.187 -1.729,-0.187 -2.578,0 L 18.387915,23.004969 c -2.751,0.605 -4.711,3.043 -4.711,5.86 v 25.803 c 0,3.314 2.687,6 6,6 h 9.59 v 78.574001 c -8.67,0.45 -15.59,7.624 -15.59,16.404 v 9.636 c -7.8350004,1.411 -13.80200044,8.264 -13.80200044,16.499 v 15.023 c 0,3.314 2.68700004,6 6.00000004,6 h 13.8020004 203.571995 13.802 c 3.313,0 6,-2.686 6,-6 v -15.023 c 0,-8.235 -5.968,-15.088 -13.802,-16.5 z m -203.571995,-9.636 c 0,-2.452 1.995,-4.447 4.447,-4.447 H 212.80191 c 2.452,0 4.447,1.995 4.447,4.447 v 9.355 H 25.676915 Z m 32.67,-16.447 h -17.08 V 62.416969 h 17.08 z M 124.80791,60.667969 v 78.530001 h -6.689 V 60.667969 Z m 29.081,78.530001 h -17.081 V 62.416969 h 17.081 z m 47.77,0 h -17.08 V 62.416969 h 17.08 z m -95.541,-76.781001 V 139.19797 H 89.036915 V 62.416969 Z M 11.874915,181.78097 c 0,-2.636 2.145,-4.78 4.78,-4.78 h 3.021 6 191.571995 6 3.021 c 2.636,0 4.78,2.145 4.78,4.78 v 9.023 h -13.802 -191.569995 -13.802 z m 160.703995,-42.583 h -6.69 V 60.667969 h 6.69 z M 25.676915,33.687969 l 95.785995,-21.069 95.786,21.069 v 14.979 H 25.676915 Z m 51.36,26.98 v 78.530001 h -6.69 V 60.667969 Z" />
      </svg>`
  })
}

const airportIcon = (markerColor: string) => {
  return L.divIcon({
    className: 'to-just-remove-default-class',
    iconSize: [24, 24],
    shadowSize: [0, 0],
    html:
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <path 
          d="M 91.268,28.17 C 91.308,16.432 109.015,16.432 109.015,28.514 L 109.015,77.831 L 178.023,119.336 L 178.023,137.549 L 109.319,114.945 L 109.319,151.776 L 125.205,164.221 L 125.205,178.61 L 100.698,171.001 L 76.191,178.61 L 76.191,164.221 L 91.915,151.776 L 91.915,114.945 L 23.191,137.549 L 23.191,119.336 L 91.248,77.831 L 91.248,28.17 z" 
          fill="${markerColor}"
        />
      </svg>`
  })
}

export const Basic = ({ markerColor }: { markerColor: string }) => {
  return (
    <LeafletMap
      jsxRenderer={ReactDOM.render}
      options={{
        minZoom: 10,
        maxZoom: 15,
        zoom: 10,
        maxBoundsViscosity: 1,
        center: [34.052235, -118.243683]
      }}
    >
      <lfTiles urlTemplate='https://tile.openstreetmap.fr/openriverboatmap/{z}/{x}/{y}.png' options={{
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }} />

      <lfMarker
        latlng={[34.052235, -118.243683]}
        onAdd={() => { console.log('added a marker layer for LA') }}
      >
        <lfTooltip options={{ direction: 'right', offset: [25, 25] }}>
          <div>Los Angelest, USA</div>
        </lfTooltip>
      </lfMarker>

      <lfMarker latlng={[34.063754, -118.359228]} options={{ icon: museumIcon(markerColor) }}>
        <lfPopup options={{ offset: [0, -10], interactive: true, autoClose: true }}>
          <div>
            Los Angeles County Museum of Art
            <div>
              <a href='http://www.lacma.org/' target="_new">website</a>
            </div>
          </div>
        </lfPopup>
      </lfMarker>

      <lfMarker latlng={[33.8615661, -118.0851658]} options={{ icon: museumIcon(markerColor) }}>
        <lfPopup options={{ offset: [0, -10], interactive: true, autoClose: true }}>
          <div>
            Artesia Historical Museum
            <div>
              <a href='http://www.ahslac.org/' target="_new">website</a>
            </div>
          </div>
        </lfPopup>
      </lfMarker>

      <lfMarker latlng={[33.942698, -118.408373]} options={{ icon: airportIcon(markerColor) }}>
        <lfPopup options={{ offset: [0, -10], interactive: true, autoClose: true }}>
          <div>
            Los Angeles International Airport
            <div>
              <a href='http://www.flylax.com/' target="_new">website</a>
            </div>
          </div>
        </lfPopup>
      </lfMarker>

      <lfMarker latlng={[34.017789, -118.447359]} options={{ icon: airportIcon(markerColor) }}>
        <lfPopup options={{ offset: [0, -10], interactive: true, autoClose: true }}>
          <div>
            Santa Monica Airport
            <div>
              <a href='http://www.smgov.net/' target="_new">website</a>
            </div>
          </div>
        </lfPopup>
      </lfMarker>

      <lfMarker latlng={[33.889804, -118.243674]} options={{ icon: airportIcon(markerColor) }}>
        <lfPopup options={{ offset: [0, -10], interactive: true, autoClose: true }}>
          <div>
            Campton / Woodley Airport
            <div>
              <a href='http://www.camptoncity.org/' target="_new">website</a>
            </div>
          </div>
        </lfPopup>
      </lfMarker>

      <lfMarker latlng={[33.816094, -118.151255]} options={{ icon: airportIcon(markerColor) }}>
        <lfPopup options={{ offset: [0, -10], interactive: true, autoClose: true }}>
          <div>
            Long Beach Airport
            <div>
              <a href='http://www.lgb.org/' target="_new">website</a>
            </div>
          </div>
        </lfPopup>
      </lfMarker>

      <lfCircleMarker latlng={[33.917595, -117.724538]} options={{ weight: 1.5, color: markerColor }}>
        <lfTooltip options={{ direction: 'right', offset: [5, 0] }}>
          <div>Chino Hills State Park</div>
        </lfTooltip>
      </lfCircleMarker>

      <lfCircleMarker latlng={[33.838530, -117.838169]} options={{ weight: 1.5, color: markerColor }}>
        <lfTooltip options={{ direction: 'right', offset: [5, 0] }}>
          <div>Eisenhower Park</div>
        </lfTooltip>
      </lfCircleMarker>

    </LeafletMap>
  )
}

export default {
  title: 'Maps/Basic',
  component: LeafletMap,
  argTypes: {
    markerColor: {
      control: { type: 'color', presetColors: ['#3e78cf'] },
      name: 'Markers color',
      table: {
        type: { summary: 'The primary color to use for the markers on this map.' },
        defaultValue: { summary: '#3e78cf' }
      }
    }
  },
  args: {
    markerColor: '#3e78cf'
  },
  parameters: {
    controls: { expanded: true },
    docs: {
      description: {
        component:
          `
This story demonstrates how to use leaflet layers when using this library. Displaying a popup within a layer is an interesting case. 
To do so, a \`lfPopup\` is added as a single child of the layer in JSX. Same technique is used when declaring \`lfTooltip\`.
        `
      }
    }
  }
}
