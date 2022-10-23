import React from 'react'
import L from 'leaflet'
import ReactDOM from 'react-dom'

import './storybook.css'

import LeafletMap from '../lib/map'
import { LeafletIntrinsicElements, LeafletExtensions } from '../lib/catalog'
import { CustomTileLayer, CustomTileLayerProps } from './components/custom-tile-layer'
import { WindowResizeHandler } from './components/resize-handler'
import { WatermarkControl, WatermarkControlParams } from './components/watermark-control'

/** (Typescript) Modify the global namespace to add your custom JSX elements that you can use with leaflet-react-fibers */
declare global {
  /** Extends the LeafletIntrinsicElements with your own custom elements */
  // (Optional) specify the P (aka props or second generic parameter), default from base class or even don't specify it
  interface CustomLeafletElements extends globalThis.JSX.Element, LeafletIntrinsicElements {
    lfCustomLayer: LeafletExtensions.Layer<CustomTileLayer, CustomTileLayerProps>
    lfWaterMarkControl: LeafletExtensions.Control<WatermarkControl, WatermarkControlParams>
    lfResizeHandler: LeafletExtensions.Handler<WindowResizeHandler>
  }

  /** Tell JSX to use your extended interface instead of LeafletIntrinsicElements */
  export namespace JSX {
    // eslint-disable-next-line
    interface IntrinsicElements extends CustomLeafletElements { }
  }
}

export const Customization = ({ windowResizeHandlerEnabled, controlPosition, controlImageWidth }:
  { windowResizeHandlerEnabled: boolean, controlPosition: L.ControlPosition, controlImageWidth: number }) => {
  return (
    <div style={{ height: 500 }}>
      <LeafletMap
        jsxRenderer={ReactDOM.render}
        whenReady={(map) => console.log('Map is ready and we have an instance of the map passed in')}
        options={{
          minZoom: 1,
          maxZoom: 50,
          zoom: 10,
          maxBoundsViscosity: 1,
          center: [42.331429, -83.045753]
        }}
      >
        <lfCustomLayer klass={CustomTileLayer} onAdd={() => { console.log('added a custom layer') }} />
        <lfWaterMarkControl klass={WatermarkControl} params={{ position: controlPosition, controlImageWidth }} />
        <lfResizeHandler name="windowResize" klass={WindowResizeHandler} enabled={windowResizeHandlerEnabled} />
      </LeafletMap>
    </div>
  )
}

export default {
  title: 'Maps/Customization',
  component: LeafletMap,
  argTypes: {
    controlPosition: {
      options: ['topleft', 'topright', 'bottomleft', 'bottomright'],
      control: { type: 'select' },
      name: 'Custom control image position',
      table: {
        type: { summary: 'The leaflet logo as a control is positioned on the map. You can update its position.' },
        defaultValue: { summary: 'bottomleft' }
      }
    },
    windowResizeHandlerEnabled: {
      options: [true, false],
      name: 'Simple window resize watch',
      table: {
        type: { summary: 'After enabling this resize the browser window then open the browser console for window resize message.' },
        defaultValue: { summary: false }
      }
    },
    controlImageWidth: {
      control: { type: 'number' },
      name: 'Custom control image width',
      table: {
        type: { summary: 'Change the image width without re-rendering other layers. Typically you would require a layer reference to achieve this when using the leaflet API.' },
        defaultValue: { summary: 200 }
      }
    }
  },
  args: {
    controlPosition: 'bottomleft',
    controlImageWidth: 200,
    windowResizeHandlerEnabled: false
  },
  parameters: {
    controls: { expanded: true },
    docs: {
      description: {
        component:
          `
This story demonstrates the advanced customization that comes with this library.
Specifically the ability to inject a JSX renderer into leaflet controls and layers to 
simplify rendering content. Another goal of this story is to demonstrate state management.
Advanced leaflet customizations can benefit from a state management library.
Third party state management is not requires when using this library.
        `
      }
    }
  }
}
