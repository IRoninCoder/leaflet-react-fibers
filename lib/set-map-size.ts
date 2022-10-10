import L from 'leaflet'

import { CustomMapOptions } from './catalog'

/** Determine a size for a leaflet map inside a browser window */
const setMapSize = (map: L.Map, container: HTMLElement, style?: Record<string, any>, maxBounds?: CustomMapOptions['maxBounds']) => {
  if (style?.width && style?.height) {
    // do nothing, it's already applied via spread operator in map.tsx
  } else if (maxBounds) {
    const nw = map.latLngToContainerPoint(L.latLng(maxBounds[0]))
    const se = map.latLngToContainerPoint(L.latLng(maxBounds[1]))
    const size = { w: nw.distanceTo(L.point(se.x, nw.y)), h: nw.distanceTo(L.point(nw.x, se.y)) }
    container.style.width = size.w + 'px'
    container.style.height = size.h + 'px'
  } else {
    const parent = container.parentElement

    if (!parent) {
      throw Error('leaflet-react-fibers: unable to determine the map dimensions. This is required by leaflet, but not provided. We tried to find a parent element in DOM, but could not find one.')
    } else if (parent.clientWidth < 10 || parent.clientHeight < 10) {
      console.warn(`leaflet-react-fibers: width or height is less than 10px. We found a parent element in DOM to use for dimensions, but this parent element has a width of "${parent.clientWidth}px" and height of "${parent.clientHeight}px".`)
    }

    container.style.width = '100%'
    container.style.height = '100%'
  }

  map.invalidateSize()
}

export default setMapSize
