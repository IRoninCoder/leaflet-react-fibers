import React from 'react';
import { ComponentMeta } from '@storybook/react';
import L from 'leaflet'

import './map.css'

import LeafletMap from '../lib/map'
import ReactDOM from 'react-dom';
import { CustomMapOptions } from '../lib/types';

export default {
  title: 'Example/Map',
  component: LeafletMap,
} as ComponentMeta<typeof LeafletMap>;

const mapOpts: CustomMapOptions = {
  minZoom: 1,
  maxZoom: 10,
  zoom: 1,
  maxBoundsViscosity: 1
}

export const ImageWithPopup = ({ togglePopUp, lat, lng }: { togglePopUp: boolean, lat: number, lng: number }) => {
  return (
    <LeafletMap options={mapOpts} jsxRenderer={ReactDOM.render}>
      <lfPopup latlng={[lat, lng]} isOpen={togglePopUp} onAdd={() => { console.log('added a popup layer') }} ><div>Hello world!</div></lfPopup>
      <lfImage imageUrl="https://images.pexels.com/photos/9569798/pexels-photo-9569798.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" bounds={[[-250, -250], [250, 250]]} onAdd={() => { console.log('added an image layer') }} />
    </LeafletMap>
  )
}
ImageWithPopup.args = {
  lat: 0,
  lng: 0,
  togglePopUp: false
}

export const PopupAndTooltip = () => {
  return (
    <LeafletMap options={mapOpts} jsxRenderer={ReactDOM.render}>
      <lfImage imageUrl="https://images.pexels.com/photos/9569798/pexels-photo-9569798.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" bounds={[[-250, -250], [250, 250]]} onAdd={() => { console.log('added an image layer') }} />

      <lfRectangle bounds={[[10, 0], [50, 100]]} options={{ fillColor: 'red' }} onAdd={() => { console.log('added a rectangle layer') }}>
        <lfPopup latlng={[100, 100]} onAdd={() => { console.log('added a popup layer') }}><div>Hello world!</div></lfPopup>
      </lfRectangle>

      <lfRectangle bounds={[[10, -20], [50, -120]]} options={{ fillColor: 'red' }} onAdd={() => { console.log('added a rectangle layer') }}>
        <lfTooltip onAdd={() => { console.log('added a tooltip') }}><div>Hello world!</div></lfTooltip>
      </lfRectangle>
    </LeafletMap>
  )
}

export const RectangleWithMarker = () => {
  return (
    <LeafletMap options={mapOpts} whenReady={(map) => map.flyToBounds([[0, 50], [50, 100]])}>
      <lfRectangle bounds={[[0, 50], [50, 100]]} options={{ fillColor: 'black' }} onAdd={() => { console.log('added a rectangle layer') }} />
      <lfMarker latlng={[25, 55]} onAdd={() => { console.log('added an marker layer') }} />
    </LeafletMap>
  )
}

export const Tiles = () => {
  return (
    <LeafletMap options={{ ...mapOpts, zoom: 4 }} >
      <lfTiles urlTemplate='https://tile.openstreetmap.org/{z}/{x}/{y}.png' options={{
        tileSize: 512,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }} />
    </LeafletMap>
  )
}

export const TilesWMS = () => {
  return (
    <LeafletMap options={{ ...mapOpts, zoom: 4 }}>
      <lfTilesWMS baseUrl="http://ows.mundialis.de/services/service?" options={{
        layers: 'TOPO-OSM-WMS',
        format: 'image/png',
        transparent: true,
        attribution: "Weather data © 2012 IEM Nexrad"
      }} />
    </LeafletMap>
  )
}

export const VideoPolylinePolygonAndCircle = () => {
  return (
    <LeafletMap options={mapOpts} whenReady={(map) => map.flyToBounds([[10, 300], [200, 100]])}>
      <lfVideo video="https://www.mapbox.com/bites/00188/patricia_nasa.webm" bounds={[[10, 300], [200, 100]]} />
      <lfPolyline latlngs={[
        [45.51, 122.68],
        [37.77, 122.43],
        [34.04, 118.2]
      ]} />
      <lfPolygon latlngs={[
        [65.51, 132.68],
        [47.77, 142.43],
        [54.04, 218.2]
      ]} />
      <lfCircle latlng={[50, 100]} options={{radius:900000}} />
    </LeafletMap>
  )
}

export const CircleMarkerAndSVG = () => {
  const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgElement.setAttribute('xmlns', "http://www.w3.org/2000/svg");
  svgElement.setAttribute('viewBox', "0 0 200 200");
  svgElement.innerHTML = '<rect width="200" height="200"/><rect x="75" y="23" width="50" height="50" style="fill:red"/><rect x="75" y="123" width="50" height="50" style="fill:#0013ff"/>';

  return (
    <LeafletMap options={mapOpts}>
      <lfCircleMarker latlng={[200, 100]} />
      <lfSVG svgImage={svgElement} bounds={[[32, -130], [13, -100]]} />
    </LeafletMap>
  )
}

export const GeoJSON = ({ geoJSON }: any) => {
  return (
    <LeafletMap options={{ ...mapOpts, maxBounds: undefined, zoom: 6 }} whenReady={(m) => m.setView([0, 102])}>
      <lfGeoJSON geojson={geoJSON} />
    </LeafletMap>
  )
}
GeoJSON.args = {
  geoJSON: {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "LineString",
          "coordinates": [
            [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]
          ]
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [[100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
            [100.0, 1.0], [100.0, 0.0]]
          ]

        }
      }
    ]
  }
}

export const Grid = () => {
  return (
    <LeafletMap options={mapOpts}>
      <lfGridLayer options={{ className: 'leaflet-tile-borders' }} />
    </LeafletMap>
  )
}

export const LayerGroup = () => {
  return (
    <LeafletMap options={mapOpts} whenReady={(map) => map.panTo([100, 200])}>
      <lfLayerGroup>
        <lfRectangle bounds={[[0, 0], [100, 200]]} options={{ fillColor: 'black' }} />
        <lfRectangle bounds={[[0, 0], [110, 210]]} options={{ fillColor: 'black' }} />
        <lfRectangle bounds={[[0, 0], [120, 220]]} options={{ fillColor: 'black' }} />
        <lfRectangle bounds={[[0, 0], [130, 230]]} options={{ fillColor: 'black' }} />
        <lfRectangle bounds={[[0, 0], [140, 240]]} options={{ fillColor: 'black' }} />
        <lfRectangle bounds={[[0, 0], [150, 250]]} options={{ fillColor: 'black' }} />
        <lfRectangle bounds={[[0, 0], [110, 200]]} options={{ fillColor: 'black' }} />
        <lfRectangle bounds={[[0, 0], [120, 200]]} options={{ fillColor: 'black' }} />
        <lfRectangle bounds={[[0, 0], [130, 200]]} options={{ fillColor: 'black' }} />
        <lfRectangle bounds={[[0, 0], [140, 200]]} options={{ fillColor: 'black' }} />
      </lfLayerGroup>
    </LeafletMap>
  )
}


export const FromLeafletHomePage = ({ togglePopUp }: { togglePopUp: boolean }) => {
  return (
    <LeafletMap options={{ center: [51.505, -0.09], zoom: 13 }} jsxRenderer={ReactDOM.render}>

      <lfTiles
        urlTemplate='https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
        options={{
          maxZoom: 18,
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          id: 'mapbox/streets-v11',
          tileSize: 512,
          zoomOffset: -1
        }}></lfTiles>

      <lfMarker latlng={[51.5, -0.09]}>
        <lfPopup isOpen={togglePopUp}>
          <div>
            <b>Hello world!</b><br />I am a popup.
          </div>
        </lfPopup>
      </lfMarker>

      <lfCircle latlng={[51.508, -0.11]} options={{
        radius: 500,
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5
      }}>
        <lfPopup>
          <span>I am a circle.</span>
        </lfPopup>
      </lfCircle>

      <lfPolygon latlngs={[
        [51.509, -0.08],
        [51.503, -0.06],
        [51.51, -0.047]
      ]}>
        <lfPopup>
          <span>I am a polygon.</span>
        </lfPopup>
      </lfPolygon>

    </LeafletMap>
  )
}
FromLeafletHomePage.args = {
  togglePopUp: false
}

export const ConditionalLayer = ({ isRedVisible, z }: any) => {
  return (
    <LeafletMap options={mapOpts} whenReady={(map) => map.flyToBounds([[0, 0], [110, 210]])}>
      <lfLayerGroup>
        {isRedVisible && z === 'first' && <lfRectangle bounds={[[0, 0], [110, 210]]} options={{ fillColor: 'red', fillOpacity: 1 }} />}
        <lfRectangle bounds={[[10, 0], [100, 300]]} options={{ fillColor: 'black' }} />
        {isRedVisible && z === 'middle' && <lfRectangle bounds={[[0, 0], [110, 210]]} options={{ fillColor: 'red', fillOpacity: 1 }} />}
        <lfRectangle bounds={[[50, 50], [10, 220]]} options={{ fillColor: 'black', fillOpacity: 1 }} />
        {isRedVisible && z === 'last' && <lfRectangle bounds={[[0, 0], [110, 210]]} options={{ fillColor: 'red', fillOpacity: 1 }} />}
      </lfLayerGroup>
    </LeafletMap>
  )
}
ConditionalLayer.args = {
  isRedVisible: false,
  z: 'first'
}
ConditionalLayer.argTypes = {
  z: {
    options: ['first', 'middle', 'last'],
    control: { type: 'select' }
  }
}

export const Mutability = ({ color, mutable }: any) => {
  return (
    <LeafletMap options={mapOpts} whenReady={(map) => map.panTo([100, 300])}>
      <lfRectangle bounds={[[10, 0], [100, 300]]} options={{ fillColor: color }} mutable={mutable} />
    </LeafletMap>
  )
}
Mutability.args = {
  color: 'black',
  mutable: true
}