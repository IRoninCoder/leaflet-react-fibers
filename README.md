<div align="center">

<img src="./stories/assets/leaflet-react-fibers.png" style="width: 10rem; margin-bottom: 1rem" alt="leaflet-react-fibers logo" />

<h1>leaflet-react-fibers</h1>

A high performance react library for _[leafletjs](https://www.leafletjs.com)_

[![npm](https://img.shields.io/npm/dm/leaflet-react-fibers?label=npm&logo=npm&color=blue)](https://www.npmjs.com/package/leaflet-react-fibers) [![license](https://img.shields.io/npm/l/leaflet-react-fibers?color=blue)](https://github.com/chickencoding123/leaflet-react-fibers/blob/main/LICENSE) [![docs](https://img.shields.io/badge/demo%20and%20docs-blue?label=see&logo=readthedocs)](https://chickencoding123.github.io/leaflet-react-fibers)

</div>

## How to use
```sh
npm i leaflet-react-fibers --save
# or
yarn add leaflet-react-fibers --save
```
```tsx
import { LeafletMap, L } from "leaflet-react-fibers"

const JustAMap = () => {
  return (
    <LeafletMap options={{ crs: L.CRS.Simple }}>
      <lfRectangle bounds={[[50, 50], [150, 100]]} options={{ fillColor: 'black' }} add={() => { console.log('added a rectangle layer') }} />
    </LeafletMap>
  )
}
```
See [Docs](https://chickencoding123.github.io/leaflet-react-fibers) for various examples.

### JSX renderer
You must provide a JSX renderer when embedding HTML in `lfPopup` or `lfTooltip` otherwise their contents are ignored, this is by design:
>:information_source: You do NOT have to use `react-dom`, any JSX renderer will suffice. 
```tsx
import { LeafletMap, L } from "leaflet-react-fibers"
import ReactDOM from "react-dom"

const PopupInsideARectangle = () => {
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

## Similar work
None of the libraries mentioned below provide mutability control out of the box and state management features.
1. [react-leaflet-fiber](https://github.com/umar-ahmed/react-leaflet-fiber) another fiber implementation.
2. [react-leaflet](https://github.com/PaulLeCam/react-leaflet) react wrapper for leaflet which comes with hooks.

## Known Issues
[x] Mutability control does not work at the moment. This is a feature of this library that allows a layer to be explicitly mutable or immutable using a `mutable` prop.

## Development
Clone this repository and simply run `npm run storybook` to get started.
