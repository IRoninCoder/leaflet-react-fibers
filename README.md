`leaflet-react-fibers`
=====================

<div align="center">

A high performance react reconciler for [leafletjs](https://www.leafletjs.com).

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/IRoninCoder/leaflet-react-fibers/blob/master/LICENSE)

</div>


## Features

- Managed DOM using JSX trees
- Extensible by design, supports stateful and stateless leaflet extensions
- Mutability control out of the box, simply add `mutable={false}` to disable mutability on leaflet layers or controls


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
You must provide a JSX renderer when embeding HTML in `lfPopup` or `lfTooltip` otherwise their contents are ignored, this is by design:
```tsx
import { LeafletMap, L } from "leaflet-react-fibers"

const PopupInsideRectangle = () => {
  return (
    <LeafletMap options={{ crs: L.CRS.Simple }}>
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


## Development
Clone this repository and simply run `yarn storybook` or `npm run storybook`.
