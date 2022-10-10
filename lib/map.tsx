import React, { useRef, useLayoutEffect, useState } from 'react'
import L from 'leaflet'

import './map.css'

import Renderer from './renderer'
import { CustomMapOptions, IntrinsicMapChildren, JSXRenderer } from './catalog'
import SetMapSize from './set-map-size'

export const MapContext = React.createContext<{ map: L.Map | null }>({ map: null })

// eslint-disable-next-line no-use-before-define
const defaultProps: ILeafletMapProps = {
  children: [] as any,
  options: {
    crs: L.CRS.EPSG3857,
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
          SetMapSize(mp, containerRef.current as HTMLDivElement, mergedProps.style, mergedOptions.maxBounds)
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
