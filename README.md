`leaflet-react-fibers`
=====================

<div align="center">

A high performance react library for leafletjs https://www.leafletjs.com

<img src="/assets/leaflet-react-fibers.png" style="width: 10rem; margin-bottom: 1rem" alt="leaflet-react-fibers logo" />

[![npm](https://img.shields.io/npm/v/leaflet-react-fibers)](https://www.npmjs.com/package/leaflet-react-fibers) [![License](https://img.shields.io/npm/l/leaflet-react-fibers)](https://github.com/chickencoding123/leaflet-react-fibers/blob/main/LICENSE)

</div>

## Features

- Managed DOM using JSX trees
- Extensible by design, supports stateful and stateless (standard) leaflet extensions
- Mutability control out of the box, simply add `mutable={false}` to disable mutability on leaflet layers or controls
- Control over your layer `z-index` out of the box via conditional JSX nodes
- Automatic map sizing by  `maxBounds` or parent container size


## How to use
```sh
npm i leaflet-react-fibers --save
# or
yarn add leaflet-react-fibers --save
```
```tsx
import { LeafletMap, L } from "leaflet-react-fibers"

const Rectangle = () => {
  return (
    <LeafletMap options={{ crs: L.CRS.Simple }}>
      <lfRectangle bounds={[[50, 50], [150, 100]]} options={{ fillColor: 'black' }} add={() => { console.log('added a rectangle layer') }} />
    </LeafletMap>
  )
}
```
See `stories` for various examples.

### JSX renderer
You must provide a JSX renderer when embedding HTML in `lfPopup` or `lfTooltip` otherwise their contents are ignored, this is by design:
```tsx
import { LeafletMap, L } from "leaflet-react-fibers"
import ReactDOM from "react-dom"

const PopupInsideRectangle = () => {
  return (
    <LeafletMap options={{ crs: L.CRS.Simple }} jsxRenderer={ReactDOM.render}>
       <lfRectangle bounds={[[50, 50], [150, 100]]} options={{ fillColor: 'black' }} add={() => { console.log('added a rectangle layer') }}>
        <lfPopup latlng={[100, 100]} add={() => { console.log('added an popup layer') }}>
          <div>Hello world!</div>
        </lfPopup>
      </lfRectangle>
    </LeafletMap>
  )
}
```
You do NOT have to use `ReactDOM`, any JSX renderer will suffice. 


### Customization
There are two customizatio techniques. First is the standard customization provided by the [leafletjs](https://www.leafletjs.com) and this requires a  map instance:
```tsx
<LeafletMap options={{ /* options here */ }} whenReady={(map) => console.log('Map is ready and we have an instance of the map passed in. Use it as you wish to customize etc...')}>
  /* TODO layers */
</LeafletMap>
```

Second customization technique is more advanced towards state management within your customized layers, controls or handlers. Instead of the standard customization you can opt in to customize this way:

```tsx
import { JSXRenderer, LeafletIntrinsicElements, LeafletExtensions } from "leaflet-react-fibers"
import ReactDOM from 'react-dom'

// 1. A new control extends a control class
type WatermarkControlParams = { controlImageWidth: number } & L.ControlOptions
class WatermarkControl extends L.Control implements LeafletExtensions.Stateful<{ lastW: number }> {
  controlImageWidth: number
  private _renderer: JSXRenderer

  // if you've provided a jsxRenderer in map props, then it'll be passed down here as an argument so you can use it to build jsx content
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
        backgroundColor: 'rgba(255,255,255,0.6)',
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

// 2. A component
export const Watermark = ({ position }: { position: L.ControlPosition }) => {
  return (
    <LeafletMap options={{ zoom: 1 }} jsxRenderer={ReactDOM.render}>
      <lfWaterMarkControl klass={WatermarkControl} params={{ position, controlImageWidth: 200 }} />
    </LeafletMap>
  )
}

// 3. Global JSX markup extension
declare global {
  interface CustomLeafletElements extends JSX.Element, LeafletIntrinsicElements {
    lfWaterMarkControl: LeafletExtensions.Control<WatermarkControl, WatermarkControlParams>
  }

  namespace JSX {
    interface IntrinsicElements extends CustomLeafletElements { }
  }
}
```
A few things are happening here. First is the ability to control the state within your customized control. The renderer will recognize that your customized control is stateful and will use `getState` and `setState` when your props change and the control needs to be re-rendered. Additionally a renderer is passed through to the constructor of the control, if it has been provided via map props. 

## Similar work
None of the libraries mentioned below provide mutability control out of the box and state management features.
1. [react-leaflet-fiber](https://github.com/umar-ahmed/react-leaflet-fiber) another fiber implementation.
2. [react-leaflet](https://github.com/PaulLeCam/react-leaflet) react wrapper for leaflet which comes with hooks.

## Development
Clone this repository and simply run `npm run storybook`.
