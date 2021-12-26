import React from 'react';
import { ComponentMeta } from '@storybook/react';
import L from 'leaflet'

import './map.css'

import LeafletMap from '../lib/map'
import { JSXRenderer, LeafletIntrinsicElements, LeafletExtensions, CustomMapOptions } from '../lib/types';
import ReactDOM from 'react-dom';

export default {
  title: 'Example/Customizations',
  component: LeafletMap,
  argTypes: {
    controlPosition: {
      options: ['topleft', 'topright', 'bottomleft', 'bottomright'],
      control: { type: 'select' },
      name: 'Control position',
      description: 'The leaflet logo as a control is positioned on the map. You can update its position.'
    },
    windowResizeHandlerEnabled: {
      options: [true, false],
      name: 'Window resize handler',
      description: 'After enabling this rresize the browser windowSee then see the browser console for window resize message.'
    },
    controlImageWidth: {
      control: { type: 'number' },
      name: 'Control image width'
    }
  }
} as ComponentMeta<typeof LeafletMap>;

/** Begin a custom handler */
// extend the default handler class
class WindowResizeHandler extends L.Handler {
  constructor(map: L.Map) { super(map) }

  addHooks() {
    L.DomEvent.on(window as any, 'resize', this._windowResize, this);
  }

  removeHooks() {
    L.DomEvent.off(window as any, 'resize', this._windowResize, this);
  }

  _windowResize(ev) {
    console.log('You just reized the window')
  }
};
/** End a custom handler */

/** Begin a custom layer */
// extends the default tile layer with a new sub-type, Kittens
type KittenLayerProps = { options?: L.TileLayerOptions }
class KittenLayer extends L.TileLayer {
  constructor(params: KittenLayerProps) {
    super('', params.options)
  }

  getTileUrl(coords) {
    const i = Math.ceil(Math.random() * 4);
    return "https://placekitten.com/256/256?image=" + i;
  }

  getAttribution() {
    return "<a href='https://placekitten.com/attribution.html'>PlaceKitten</a>"
  }
}
/** End a custom layer */

/** Begin a custom control */
// extend the default control class
type WatermarkControlParams = { controlImageWidth: number } & L.ControlOptions
class WatermarkControl extends L.Control implements LeafletExtensions.Stateful<{ lastW: number }> {
  controlImageWidth: number
  private _renderer: JSXRenderer

  // if you've provided a jsxRenderer to options, then it'll be passed down here as params.jsxRenderer so you can use it to build jsx content
  constructor({ controlImageWidth, jsxRenderer, ...options }: LeafletExtensions.Updatable<WatermarkControlParams>) {
    super(options)
    this.controlImageWidth = controlImageWidth
    this._renderer = jsxRenderer
  }

  getState() {
    return { lastW: this.controlImageWidth }
  }

  setState(state: { lastW: number }): void {
    console.log(`WatermarkControl state is set to ${state.lastW}`)
  }

  onAdd(map: L.Map) {
    const container = L.DomUtil.create('div')

    this._renderer(
      <img style={{
        width: `${this.controlImageWidth}px`,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: '5px'
      }} src='https://leafletjs.com/docs/images/logo.png' />,
      container
    )

    return container
  }

  onRemove(map: L.Map) {
    // Nothing to do here
  }
}
/** End a custom control */

/** (Typescript) Modify the global namespace to add your custom JSX elements that you can use with react-leaflet-fibers */
declare global {
  /** Extends the LeafletIntrinsicElements with your own custom elements */
  // (Optional) specify the P (aka props or second generic parameter), default from base class or even don't specify it
  interface CustomLeafletElements extends JSX.Element, LeafletIntrinsicElements {
    lfKittenLayer: LeafletExtensions.Layer<KittenLayer, KittenLayerProps>
    lfWaterMarkControl: LeafletExtensions.Control<WatermarkControl, WatermarkControlParams>
    lfResizeHandler: LeafletExtensions.Handler<WindowResizeHandler>
  }

  /** Tell JSX to use your extended interface instead of LeafletIntrinsicElements */
  namespace JSX {
    interface IntrinsicElements extends CustomLeafletElements { }
  }
}

// end of customizations, now we can use them

const mapOpts: CustomMapOptions = {
  minZoom: 1,
  maxZoom: 10,
  zoom: 1,
  maxBoundsViscosity: 1
}

export const RectangleKittenWatermarkAndHandler = ({ windowResizeHandlerEnabled, controlPosition, controlImageWidth }:
  { windowResizeHandlerEnabled: boolean, controlPosition: L.ControlPosition, controlImageWidth: number }) => {
  return (
    <LeafletMap options={mapOpts} jsxRenderer={ReactDOM.render} whenReady={(map) => console.log('Map is ready and we have an instance of the map passed in')}>
      <lfKittenLayer klass={KittenLayer} params={{ options: { bounds: mapOpts.maxBounds } }} onAdd={() => { console.log('added a custom layer named kitten layer') }} />
      <lfWaterMarkControl klass={WatermarkControl} params={{ position: controlPosition, controlImageWidth }} />
      <lfResizeHandler name="windowResize" klass={WindowResizeHandler} enabled={windowResizeHandlerEnabled} />
    </LeafletMap>
  )
}
RectangleKittenWatermarkAndHandler.args = {
  windowResizeHandlerEnabled: false,
  controlPosition: 'bottomleft',
  controlImageWidth: 200
}