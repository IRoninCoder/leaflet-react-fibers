import React, { useRef, useLayoutEffect, useState } from 'react'
import L, { CRS } from 'leaflet'

import './map.css'

import Renderer from './renderer'
import { CustomMapOptions, IntrinsicMapChildren, JSXRenderer } from './types'

const setMapSize = (map: L.Map, container: HTMLElement, style?: React.CSSProperties, maxBounds?: CustomMapOptions['maxBounds']) => {
  if (style && style.width && style.height) {
    // do nothing, it's already applied via spread operator in container JSX
  } else if (maxBounds) {
    const nw = map.latLngToContainerPoint(L.latLng(maxBounds[0]))
    const se = map.latLngToContainerPoint(L.latLng(maxBounds[1]))
    const size = {
      w: nw.distanceTo(L.point(se.x, nw.y)),
      h: nw.distanceTo(L.point(nw.x, se.y))
    }
    container.style.width = size.w + 'px'
    container.style.height = size.h + 'px'
  } else {
    // find a sized parent, that is, a parent which is not dimensioned zero in width or height
    let parent = container.parentElement
    let sizedRect = parent?.getBoundingClientRect()

    while (parent && (!sizedRect || !sizedRect.width || !sizedRect.height)) {
      sizedRect = parent.getBoundingClientRect()
      parent = parent.parentElement
    }

    if (!sizedRect || !sizedRect.width || !sizedRect.height) {
      throw Error('leaflet-react-fibers: unable to determine the map size. This is required by leaflet, but not provided. We tried to find a sized parent element, but could not find one.')
    }

    parent = parent as HTMLElement
    container.style.width = sizedRect.width + 'px'
    container.style.height = sizedRect.height + 'px'

    // prepare an auto-size listener when parent size changes
    const resizeObserver = new ResizeObserver((e: ResizeObserverEntry[]) => {
      if (container) {
        const rect = e[0].contentRect
        container.style.width = rect.width + 'px'
        container.style.height = rect.height + 'px'
      }
    })
    resizeObserver.observe(parent, { box: 'border-box' })
    map.once('remove', resizeObserver.disconnect)
  }

  map.invalidateSize()
}

export const MapContext = React.createContext<{ map: L.Map | null }>({ map: null })

const defaultProps: ILeafletMapProps = {
  children: [] as any,
  options: {
    crs: CRS.EPSG3857,
    center: [0, 0],
    zoom: 0
  },
  style: {
  }
}

export interface ILeafletMapProps extends React.AllHTMLAttributes<HTMLDivElement> {
  children?: IntrinsicMapChildren['children']
  /** Leaflet map options */
  options?: CustomMapOptions
  /** Leaflet map events */
  whenReady?: (map: L.Map) => void
  /** A renderer to use for inner HTML E.g. lfPopup content */
  jsxRenderer?: JSXRenderer
}

const LeafletMap = ({ children, options, whenReady, jsxRenderer, ...restProps }: ILeafletMapProps = { options: {} }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<L.Map | null>(null)
  const { options: mergedOptions, ...mergedProps } = {
    ...defaultProps,
    options: {
      ...defaultProps.options,
      ...options
    },
    style: {
      ...defaultProps.style,
      ...restProps.style
    },
    ...restProps
  }

  useLayoutEffect(() => {
    if (containerRef.current) {
      const wrapped = (
        <lfMap options={mergedOptions} whenReady={(mp) => {
          setMapSize(mp, containerRef.current as HTMLDivElement, mergedProps.style, mergedOptions.maxBounds)
          setMap(mp)

          if (whenReady) {
            whenReady(mp)
          }
        }}>
          <MapContext.Provider value={{ map }}>
            {children}
          </MapContext.Provider>
        </lfMap>
      )

      Renderer.render(wrapped, containerRef.current, jsxRenderer)
    }
  }, [children, options, containerRef.current])

  return <div ref={containerRef} {...mergedProps}></div>
}

export default LeafletMap
