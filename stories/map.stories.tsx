/// <reference types="../@types" />

import React from 'react';
import { ComponentMeta } from '@storybook/react';
import L from 'leaflet'

import './map.css'

import LeafletMap from '../lib/map'
import Screenshot from './assets/ddg-screenshot.png'
import ReactDOM from 'react-dom';
import { CustomMapOptions } from '../lib/types';

export default {
  title: 'Example/Map',
  component: LeafletMap,
} as ComponentMeta<typeof LeafletMap>;

const mapOpts: CustomMapOptions = {
  crs: L.CRS.Simple,
  minZoom: 1,
  maxZoom: 10,
  zoom: 1,
  zoomControl: false,
  maxBoundsViscosity: 1,
  attributionControl: false
}

export const ImageWithPopup = ({ togglePopUp, lat, lng }: { togglePopUp: boolean, lat: number, lng: number }) => {
  return (
    <LeafletMap options={mapOpts} jsxRenderer={ReactDOM.render}>
      <lfPopup latlng={[lat, lng]} isOpen={togglePopUp} onAdd={() => { console.log('added a popup layer') }} ><div>Hello world!</div></lfPopup>
      <lfImage imageUrl={Screenshot} bounds={[[-250, -250], [250, 250]]} onAdd={() => { console.log('added an image layer') }} />
    </LeafletMap>
  )
}
ImageWithPopup.args = {
  lat: 100,
  lng: 100,
  togglePopUp: false
}

export const PopupInsideRectangle = () => {
  return (
    <LeafletMap options={mapOpts} jsxRenderer={ReactDOM.render}>
      <lfImage imageUrl={Screenshot} bounds={[[-250, -250], [250, 250]]} onAdd={() => { console.log('added an image layer') }} />
      <lfRectangle bounds={[[50, 50], [150, 100]]} options={{ fillColor: 'black' }} onAdd={() => { console.log('added a rectangle layer') }}>
        <lfPopup latlng={[100, 100]} onAdd={() => { console.log('added a popup layer') }}><div>Hello world!</div></lfPopup>
      </lfRectangle>
    </LeafletMap>
  )
}

export const TooltipInsideRectangle = () => {
  return (
    <LeafletMap options={mapOpts} jsxRenderer={ReactDOM.render}>
      <lfImage imageUrl={Screenshot} bounds={[[-250, -250], [250, 250]]} onAdd={() => { console.log('added an image layer') }} />
      <lfRectangle bounds={[[50, 50], [150, 100]]} options={{ fillColor: 'black' }} onAdd={() => { console.log('added a rectangle layer') }}>
        <lfTooltip onAdd={() => { console.log('added a tooltip') }}><div>Hello world!</div></lfTooltip>
      </lfRectangle>
    </LeafletMap>
  )
}

export const RectangleWithMarker = () => {
  return (
    <LeafletMap options={mapOpts}>
      <lfRectangle bounds={[[50, 50], [150, 100]]} options={{ fillColor: 'black' }} onAdd={() => { console.log('added a rectangle layer') }} />
      <lfMarker latlng={[75, 75]} onAdd={() => { console.log('added an marker layer') }} />
    </LeafletMap>
  )
}

export const Tiles = () => {
  return (
    <LeafletMap options={mapOpts}>
      <lfTiles urlTemplate='https://tile.openstreetmap.org/{z}/{x}/{y}.png' options={{
        tileSize: 512,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }} />
    </LeafletMap>
  )
}

export const TilesWMS = () => {
  return (
    <LeafletMap options={mapOpts}>
      <lfTilesWMS baseUrl="http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi" options={{
        layers: 'nexrad-n0r-900913',
        format: 'image/png',
        transparent: true,
        attribution: "Weather data © 2012 IEM Nexrad"
      }} />
    </LeafletMap>
  )
}

export const VideoPolylinePolygonAndCircle = () => {
  return (
    <LeafletMap options={mapOpts}>
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
      <lfCircle latlng={[100, 100]} />
    </LeafletMap>
  )
}

export const CircleMarkerAndSVG = () => {
  var svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
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

export const GeoJSON = ({ geoJSON }) => {
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
    <LeafletMap options={mapOpts}>
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

export const ConditionalLayerFirst = ({ isRedVisible }) => {
  return (
    <LeafletMap options={mapOpts}>
      <lfLayerGroup>
        {isRedVisible && <lfRectangle bounds={[[0, 0], [110, 210]]} options={{ fillColor: 'red', fillOpacity: 1 }} />}
        <lfRectangle bounds={[[10, 0], [100, 300]]} options={{ fillColor: 'black' }} />
        <lfRectangle bounds={[[50, 50], [10, 220]]} options={{ fillColor: 'black', fillOpacity: 1 }} />
      </lfLayerGroup>
    </LeafletMap>
  )
}
ConditionalLayerFirst.args = {
  isRedVisible: false
}

export const ConditionalLayerMiddle = ({ isRedVisible }) => {
  return (
    <LeafletMap options={mapOpts}>
      <lfLayerGroup>
        <lfRectangle bounds={[[10, 0], [100, 300]]} options={{ fillColor: 'black' }} />
        {isRedVisible && <lfRectangle bounds={[[0, 0], [110, 210]]} options={{ fillColor: 'red', fillOpacity: 1 }} />}
        <lfRectangle bounds={[[50, 50], [10, 220]]} options={{ fillColor: 'black', fillOpacity: 1 }} />
      </lfLayerGroup>
    </LeafletMap>
  )
}
ConditionalLayerMiddle.args = {
  isRedVisible: false
}

export const ConditionalLayerLast = ({ isRedVisible }) => {
  return (
    <LeafletMap options={mapOpts}>
      <lfLayerGroup>
        <lfRectangle bounds={[[10, 0], [100, 300]]} options={{ fillColor: 'black' }} />
        <lfRectangle bounds={[[50, 50], [10, 220]]} options={{ fillColor: 'black', fillOpacity: 1 }} />
        {isRedVisible && <lfRectangle bounds={[[0, 0], [110, 210]]} options={{ fillColor: 'red', fillOpacity: 1 }} />}
      </lfLayerGroup>
    </LeafletMap>
  )
}
ConditionalLayerLast.args = {
  isRedVisible: false
}

export const RectangleMutable = ({ color, mutable }) => {
  return (
    <LeafletMap options={mapOpts}>
      <lfRectangle bounds={[[10, 0], [100, 300]]} options={{ fillColor: color }} mutable={mutable} />
    </LeafletMap>
  )
}
RectangleMutable.args = {
  color: 'black',
  mutable: true
}