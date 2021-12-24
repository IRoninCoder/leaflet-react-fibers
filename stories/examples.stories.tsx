/// <reference types="../@types" />

import React from 'react';
import { ComponentMeta } from '@storybook/react';
import './map.css'
import LeafletMap from '../lib/map'
import ReactDOM from 'react-dom';
import { CustomMapOptions } from '../lib/types';

export default {
  title: 'Example/From Leaflet',
  component: LeafletMap,
  argTypes: {
    togglePopUp: {
      options: [true, false],
      defaultValue: false,
      name: 'Toggle marker popup',
      description: 'The leaflet popup on the marker.'
    }
  }
} as ComponentMeta<typeof LeafletMap>;

const mapOpts: CustomMapOptions = {
  center: [51.505, -0.09],
  zoom: 13
}

export const VeryFirstExample = ({ togglePopUp }: { togglePopUp: boolean }) => {
  return (
    <LeafletMap options={mapOpts} jsxRenderer={ReactDOM.render}>

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
VeryFirstExample.args = {
  togglePopUp: false
}