// import React from 'react'
// import { ComponentMeta } from '@storybook/react'

// import './storybook.css'

// import LeafletMap from '../lib/map'
// import ReactDOM from 'react-dom'
// import { CustomMapOptions } from '../lib/catalog'

// export default {
//   title: 'Maps/Map',
//   component: LeafletMap
// } as ComponentMeta<typeof LeafletMap>

// const mapOpts: CustomMapOptions = {
//   minZoom: 1,
//   maxZoom: 10,
//   zoom: 1,
//   maxBoundsViscosity: 1
// }

// export const VideoPolylinePolygonAndCircle = () => {
//   return (
//     <LeafletMap options={mapOpts} whenReady={(map) => map.flyToBounds([[10, 300], [200, 100]])}>
//       <lfVideo video="https://www.mapbox.com/bites/00188/patricia_nasa.webm" bounds={[[10, 300], [200, 100]]} />
//     </LeafletMap>
//   )
// }

// export const CircleMarkerAndSVG = () => {
//   const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
//   svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
//   svgElement.setAttribute('viewBox', '0 0 200 200')
//   svgElement.innerHTML = '<rect width="200" height="200"/><rect x="75" y="23" width="50" height="50" style="fill:red"/><rect x="75" y="123" width="50" height="50" style="fill:#0013ff"/>'

//   return (
//     <LeafletMap options={mapOpts}>
//       <lfSVG svgImage={svgElement} bounds={[[32, -130], [13, -100]]} />
//     </LeafletMap>
//   )
// }

// export const Grid = () => {
//   return (
//     <LeafletMap options={mapOpts}>
//       <lfGridLayer options={{ className: 'leaflet-tile-borders' }} />
//     </LeafletMap>
//   )
// }

// export const FromLeafletHomePage = ({ togglePopUp }: { togglePopUp: boolean }) => {
//   return (
//     <LeafletMap options={{ center: [51.505, -0.09], zoom: 13 }} jsxRenderer={ReactDOM.render}>

//       <lfCircle latlng={[51.508, -0.11]} options={{
//         radius: 500,
//         color: 'red',
//         fillColor: '#f03',
//         fillOpacity: 0.5
//       }}>
//         <lfPopup>
//           <span>I am a circle.</span>
//         </lfPopup>
//       </lfCircle>

//       <lfPolygon latlngs={[
//         [51.509, -0.08],
//         [51.503, -0.06],
//         [51.51, -0.047]
//       ]}>
//         <lfPopup>
//           <span>I am a polygon.</span>
//         </lfPopup>
//       </lfPolygon>

//     </LeafletMap>
//   )
// }
// FromLeafletHomePage.args = {
//   togglePopUp: false
// }

// export const Mutability = ({ color, mutable }: any) => {
//   return (
//     <LeafletMap options={mapOpts} whenReady={(map) => map.panTo([100, 300])}>
//       <lfRectangle bounds={[[10, 0], [100, 300]]} options={{ fillColor: color }} mutable={mutable} />
//     </LeafletMap>
//   )
// }
// Mutability.args = {
//   color: 'black',
//   mutable: true
// }
