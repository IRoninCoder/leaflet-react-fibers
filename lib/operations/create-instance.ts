import { OpaqueHandle } from 'react-reconciler'
import L from 'leaflet'
import { isFunction } from 'lodash'

import { JSXRenderer, LeafletExtensions, LeafletIntrinsicElements } from '../catalog'
import { Container, ElementProps, ElementType, HostContext, Instance } from '../types'
import { Add, Get } from '../cache'

import Marker from 'leaflet/dist/images/marker-icon.png'
import MarkerShadow from 'leaflet/dist/images/marker-shadow.png'

/** Set props on a leaflet instance using props from a JSX node  */
const setProps = function <P extends { [key: string]: any }> (leaflet: L.Evented & { [key: string]: any }, props: P) {
  const keys = Object.keys(props)

  keys.forEach((key) => {
    if (isFunction(props[key]) && leaflet.on) {
      const leafletKey = key.startsWith('on') ? key.substring(2).toLocaleLowerCase('en-US') : key
      leaflet.on(leafletKey, props[key])
    }

    const setter = 'set' + key[0].toLocaleUpperCase('en-US') + (key.length > 1 ? key.substr(1) : '')

    if (leaflet[setter] && isFunction(leaflet[setter])) {
      leaflet[setter](props[key])
    }
  })
}

/**
 * This method should return a newly created node. For example, the DOM renderer would call `document.createElement(type)` here and then set the properties from `props`.
 *
 * You can use `rootContainer` to access the root container associated with that tree. For example, in the DOM renderer, this is useful to get the correct `document` reference that the root belongs to.
 *
 * The `hostContext` parameter lets you keep track of some information about your current place in the tree. To learn more about it, see `getChildHostContext` below.
 *
 * The `internalHandle` data structure is meant to be opaque. If you bend the rules and rely on its internal fields, be aware that it may change significantly between versions. You're taking on additional maintenance risk by reading from it, and giving up all guarantees if you write something to it.
 *
 * This method happens **in the render phase**. It can (and usually should) mutate the node it has just created before returning it, but it must not modify any other nodes. It must not register any event handlers on the parent tree. This is because an instance being created doesn't guarantee it would be placed in the tree — it could be left unused and later collected by GC. If you need to do something when an instance is definitely in the tree, look at `commitMount` instead.
 */
const createInstance = (type: ElementType, props: ElementProps, rootContainer: Container, hostContext: HostContext, internalHandle: OpaqueHandle) => {
  let instance: Instance

  switch (type) {
    case 'lfMap': {
      const { options, whenReady } = props as LeafletIntrinsicElements['lfMap']
      const mp = L.map(rootContainer, options)

      // wire this event inline
      if (whenReady) {
        mp.whenReady(() => whenReady(mp))
      }

      Add(rootContainer, mp)

      instance = {
        type,
        category: 'map',
        leaflet: mp,
        props
      }

      break
    }

    case 'lfImage': {
      const lfImageProps = props as LeafletIntrinsicElements['lfImage']
      const layer = L.imageOverlay(lfImageProps.imageUrl, lfImageProps.bounds, lfImageProps.options)

      setProps(layer, lfImageProps)

      instance = {
        type,
        category: 'layer',
        leaflet: layer,
        props
      }

      break
    }

    case 'lfPopup': {
      const { children, latlng, ...restProps } = props as LeafletIntrinsicElements['lfPopup']
      const layer = L.popup(restProps.options)
      const element = document.createElement('section') // TODO: imrove the wrapper element for lfPopup
      const contentRenderer = Get<string, JSXRenderer | undefined>('jsxRenderer')
      layer.setContent(element)

      setProps(layer, restProps)

      if (contentRenderer) {
        contentRenderer(children, element)
      }

      instance = {
        type,
        category: 'layer',
        leaflet: layer,
        props
      }

      break
    }

    case 'lfTooltip': {
      const { children, ...restProps } = props as LeafletIntrinsicElements['lfTooltip']
      const layer = L.tooltip(restProps.options)
      const element = document.createElement('section') // TODO: imrove the wrapper element for lfPopup
      const contentRenderer = Get<string, JSXRenderer | undefined>('jsxRenderer')

      layer.setContent(element)
      setProps(layer, restProps)

      if (contentRenderer) {
        contentRenderer(children as any, element)
      }

      instance = {
        type,
        category: 'layer',
        leaflet: layer,
        props
      }

      break
    }

    case 'lfRectangle': {
      const { bounds, options, ...restProps } = props as LeafletIntrinsicElements['lfRectangle']
      const layer = L.rectangle(bounds, options)
      setProps(layer, restProps)
      instance = {
        type,
        category: 'layer',
        leaflet: layer,
        props
      }
      break
    }

    case 'lfMarker': {
      const { latlng, iconOptions, ...restProps } = props as LeafletIntrinsicElements['lfMarker']
      const icon = L.icon({
        iconUrl: Marker,
        shadowUrl: MarkerShadow,
        ...(iconOptions || {})
      })
      const layer = L.marker(latlng, { icon, ...restProps.options })
      setProps(layer, restProps)
      instance = {
        type,
        category: 'layer',
        leaflet: layer,
        props
      }
      break
    }

    case 'lfTiles': {
      const { urlTemplate, ...restProps } = props as LeafletIntrinsicElements['lfTiles']
      const layer = L.tileLayer(urlTemplate, restProps.options)
      setProps(layer, restProps)
      instance = {
        type,
        category: 'layer',
        leaflet: layer,
        props
      }
      break
    }

    case 'lfTilesWMS': {
      const { baseUrl, ...restProps } = props as LeafletIntrinsicElements['lfTilesWMS']
      const layer = L.tileLayer.wms(baseUrl, restProps.options)
      setProps(layer, restProps)
      instance = {
        type,
        category: 'layer',
        leaflet: layer,
        props
      }
      break
    }

    case 'lfVideo': {
      const { video, bounds, ...restProps } = props as LeafletIntrinsicElements['lfVideo']
      const layer = L.videoOverlay(video, bounds, restProps.options)

      setProps(layer, restProps)

      instance = {
        type,
        category: 'layer',
        leaflet: layer,
        props
      }

      break
    }

    case 'lfPolyline': {
      const { latlngs, ...restProps } = props as LeafletIntrinsicElements['lfPolyline']
      const layer = L.polyline(latlngs as any, restProps.options)

      setProps(layer, restProps)

      instance = {
        type,
        category: 'layer',
        leaflet: layer,
        props
      }

      break
    }

    case 'lfPolygon': {
      const { latlngs, ...restProps } = props as LeafletIntrinsicElements['lfPolygon']
      const layer = L.polygon(latlngs, restProps.options)
      setProps(layer, restProps)
      instance = {
        type,
        category: 'layer',
        leaflet: layer,
        props
      }
      break
    }

    case 'lfCircle': {
      const { latlng, ...restProps } = props as LeafletIntrinsicElements['lfCircle']
      const layer = L.circle(latlng, restProps.options)
      setProps(layer, restProps)
      instance = {
        type,
        category: 'layer',
        leaflet: layer,
        props
      }
      break
    }

    case 'lfCircleMarker': {
      const { latlng, ...restProps } = props as LeafletIntrinsicElements['lfCircleMarker']
      const layer = L.circleMarker(latlng, restProps.options)
      setProps(layer, restProps)
      instance = {
        type,
        category: 'layer',
        leaflet: layer,
        props
      }
      break
    }

    case 'lfSVG': {
      const { svgImage, bounds, ...restProps } = props as LeafletIntrinsicElements['lfSVG']
      const layer = L.svgOverlay(svgImage, bounds, restProps.options)
      setProps(layer, restProps)
      instance = {
        type,
        category: 'layer',
        leaflet: layer,
        props
      }
      break
    }

    case 'lfLayerGroup': {
      const { children, ...restProps } = props as LeafletIntrinsicElements['lfLayerGroup']
      const layer = L.layerGroup([], restProps.options)
      setProps(layer, restProps)
      instance = {
        type,
        category: 'layergroup',
        leaflet: layer,
        props
      }
      break
    }

    case 'lfFeatureGroup': {
      const { children, ...restProps } = props as LeafletIntrinsicElements['lfFeatureGroup']
      const layer = L.featureGroup([], restProps.options)
      setProps(layer, restProps)
      instance = {
        type,
        category: 'featuregroup',
        leaflet: layer,
        props
      }
      break
    }

    case 'lfGeoJSON': {
      const { geojson, ...restProps } = props as LeafletIntrinsicElements['lfGeoJSON']
      const layer = L.geoJSON(geojson, restProps.options)
      setProps(layer, restProps)
      instance = {
        type,
        category: 'layer',
        leaflet: layer,
        props
      }
      break
    }

    case 'lfGridLayer': {
      const restProps = props as LeafletIntrinsicElements['lfGridLayer']
      const layer = L.gridLayer(restProps.options)
      setProps(layer, restProps)
      instance = {
        type,
        category: 'layer',
        leaflet: layer,
        props
      }
      break
    }
  }

  if (!instance) {
    const contentRenderer = Get<string, JSXRenderer | undefined>('jsxRenderer')

    if (type.indexOf('Layer') > -1) {
      const layerProps = props as LeafletExtensions.Layer
      const Ctor = layerProps.klass
      const klassInstance = new Ctor({ ...layerProps.params, children: layerProps.children, jsxRenderer: contentRenderer })

      setProps(klassInstance, layerProps)

      instance = {
        type,
        category: 'layer',
        leaflet: klassInstance,
        props
      }
    } else if (type.indexOf('Control') > -1) {
      const controlProps = props as LeafletExtensions.Control
      const Ctor = controlProps.klass
      const klassInstance = new Ctor({ ...controlProps.params, children: controlProps.children, jsxRenderer: contentRenderer })

      instance = {
        type,
        category: 'control',
        leaflet: klassInstance,
        props
      }
    } else if (type.indexOf('Handler') > -1) {
      const handlerProps = props as LeafletExtensions.Handler

      instance = {
        type,
        category: 'handler',
        leaflet: handlerProps.klass,
        props
      }
    }

    if (type.startsWith('lf') && !instance) {
      throw Error(`leaflet-react-fibers: Unknown type ${type}. If you are trying to use customized JSX, then make sure that your intrinsic declaration (aka tag name) ends with one of "Control", "Layer" or "Handler".`)
    }
  }

  return instance
}

export default createInstance
