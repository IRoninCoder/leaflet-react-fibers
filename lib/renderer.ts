/// <reference types="../@types" />

import ReactReconciler, { HostConfig } from 'react-reconciler'
import L from 'leaflet'
import { isEqualWith, isFunction } from 'lodash'

import Marker from 'leaflet/dist/images/marker-icon.png'
import MarkerShadow from 'leaflet/dist/images/marker-shadow.png'

import { JSXRenderer, LeafletIntrinsicElements, LeafletExtensions } from './types'

type Type = keyof LeafletIntrinsicElements
type Props = LeafletIntrinsicElements[Type]
type Container = HTMLDivElement
type HostContext = Record<string, unknown>
type UpdatePayload = {
  rootContainer: Container
  hostContext: HostContext
}
type Instance = {
  type: Type
  category: 'map' | 'layergroup' | 'featuregroup' | 'layer' | 'control' | 'handler'
  leaflet: L.Class
  props: unknown
  parent?: Instance
} | undefined
type RenderHostConfigs = HostConfig<Type, Props, Container, Instance, Instance, Instance, Instance, L.Map, HostContext, UpdatePayload, any, any, any>

const instances = new Map<HTMLElement, ReactReconciler.FiberRoot>()
const maps = new Map<HTMLElement, L.Map>()
let contentRenderer: JSXRenderer | undefined

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
const createInstance = (type: Type, props: Props, rootContainer: Container, hostContext: any, internalHandle: any) => {
  let instance: Instance

  switch (type) {
    case 'lfMap': {
      const { options, whenReady, ...restProps } = props as LeafletIntrinsicElements['lfMap']
      const mp = L.map(rootContainer, options)
      if (whenReady) {
        mp.whenReady(() => whenReady(mp))
      }
      maps.set(rootContainer, mp)

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

    case 'lfTooltip': {
      const { children, ...restProps } = props as LeafletIntrinsicElements['lfTooltip']
      const layer = L.tooltip(restProps.options)
      const element = document.createElement('section') // TODO: imrove the wrapper element for lfPopup
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
      const { latlng, ...restProps } = props as LeafletIntrinsicElements['lfMarker']
      const icon = L.icon({
        iconUrl: Marker,
        shadowUrl: MarkerShadow
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
    if (type.indexOf('Layer') > -1) {
      const layerProps = props as LeafletExtensions.Layer
      const klassInstance = new layerProps.klass({ ...layerProps.params, children: props.children, jsxRenderer: contentRenderer })
      setProps(klassInstance, layerProps)
      instance = {
        type,
        category: 'layer',
        leaflet: klassInstance,
        props
      }
    } else if (type.indexOf('Control') > -1) {
      const controlProps = props as LeafletExtensions.Control
      const klassInstance = new controlProps.klass({ ...controlProps.params, children: props.children, jsxRenderer: contentRenderer })
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

const hostConfig: RenderHostConfigs = {
  supportsMutation: true,
  supportsPersistence: false,

  createInstance,

  /**
  * Same as `createInstance`, but for text nodes. If your renderer doesn't support text nodes, you can throw here.
  */
  createTextInstance: (text, rootContainer, hostContext, internalHandle) => {
    // do not throw due to possibility of inner HTML E.g. lfPopup content
    return null as any
  },

  /**
   * This method should mutate the `parentInstance` and add the child to its list of children. For example, in the DOM this would translate to a `parentInstance.appendChild(child)` call.
   *
   * This method happens **in the render phase**. It can mutate `parentInstance` and `child`, but it must not modify any other nodes. It's called while the tree is still being built up and not connected to the actual tree on the screen.
  */
  appendInitialChild: (parentInstance, childInstance) => {
    if (!parentInstance || !childInstance) return

    childInstance.parent = parentInstance

    if (parentInstance.category === 'map' && childInstance.category === 'handler') {
      const parent = parentInstance.leaflet as L.Map & { [key: string]: L.Handler }
      const handler = childInstance.leaflet as typeof L.Handler
      const props = childInstance.props as LeafletExtensions.Handler
      parent.addHandler(props.name, handler)
      if (props.enabled) {
        parent[props.name].enable()
      } else {
        parent[props.name].disable()
      }
      return
    }

    switch (parentInstance.category) {
      case 'layergroup':
      case 'featuregroup':
      case 'map': {
        switch (childInstance.category) {
          default:
            // special treatment needed for popups, tooltips
            if (childInstance.type !== 'lfPopup' && childInstance.type !== 'lfTooltip') {
              const child = childInstance.leaflet as L.Layer | L.Control
              const parent = parentInstance.leaflet as L.Map
              child.addTo(parent)
            }
            break
        }
      }
    }
  },

  /**
   * In this method, you can perform some final mutations on the `instance`. Unlike with `createInstance`, by the time `finalizeInitialChildren` is called, all the initial children have already been added to the `instance`, but the instance itself has not yet been connected to the tree on the screen.
   *
   * This method happens **in the render phase**. It can mutate `instance`, but it must not modify any other nodes. It's called while the tree is still being built up and not connected to the actual tree on the screen.
   *
   * There is a second purpose to this method. It lets you specify whether there is some work that needs to happen when the node is connected to the tree on the screen. If you return `true`, the instance will receive a `commitMount` call later. See its documentation below.
   *
   * If you don't want to do anything here, you should return `false`.
   */
  finalizeInitialChildren: (instance, type, props, rootContainer, hostContext) => {
    return true
  },

  /**
   * React calls this method so that you can compare the previous and the next props, and decide whether you need to update the underlying instance or not. If you don't need to update it, return `null`. If you need to update it, you can return an arbitrary object representing the changes that need to happen. Then in `commitUpdate` you would need to apply those changes to the instance.
   *
   * This method happens **in the render phase**. It should only *calculate* the update — but not apply it! For example, the DOM renderer returns an array that looks like `[prop1, value1, prop2, value2, ...]` for all props that have actually changed. And only in `commitUpdate` it applies those changes. You should calculate as much as you can in `prepareUpdate` so that `commitUpdate` can be very fast and straightforward.
   *
   * See the meaning of `rootContainer` and `hostContext` in the `createInstance` documentation.
   */
  prepareUpdate: (instance, type, { children: oldChilds, ...oldProps }, { children: newChilds, ...newProps }, rootContainer, hostContext) => {
    if (propsChanged(oldProps, newProps)) {
      return {
        rootContainer,
        hostContext
      }
    }

    return null
  },

  /**
  * Some target platforms support setting an instance's text content without manually creating a text node. For example, in the DOM, you can set `node.textContent` instead of creating a text node and appending it.
  *
  * If you return `true` from this method, React will assume that this node's children are text, and will not create nodes for them. It will instead rely on you to have filled that text during `createInstance`. This is a performance optimization. For example, the DOM renderer returns `true` only if `type` is a known text-only parent (like `'textarea'`) or if `props.children` has a `'string'` type. If you return `true`, you will need to implement `resetTextContent` too.
  *
  * If you don't want to do anything here, you should return `false`.
  *
  * This method happens **in the render phase**. Do not mutate the tree from it.
  */
  shouldSetTextContent: (type, props) => {
    return false
  },

  /**
  * This method lets you return the initial host context from the root of the tree. See `getChildHostContext` for the explanation of host context.
  *
  * If you don't intend to use host context, you can return `null`.
  *
  * This method happens **in the render phase**. Do not mutate the tree from it.
  */
  getRootHostContext: (rootContainer) => {
    return {}
  },

  /**
  * Host context lets you track some information about where you are in the tree so that it's available inside `createInstance` as the `hostContext` parameter. For example, the DOM renderer uses it to track whether it's inside an HTML or an SVG tree, because `createInstance` implementation needs to be different for them.
  *
  * If the node of this `type` does not influence the context you want to pass down, you can return `parentHostContext`. Alternatively, you can return any custom object representing the information you want to pass down.
  *
  * If you don't want to do anything here, return `parentHostContext`.
  *
  * This method happens **in the render phase**. Do not mutate the tree from it.
  */
  getChildHostContext: (parentHostContext, type, rootContainer) => {
    return parentHostContext
  },

  /**
  * Determines what object gets exposed as a ref. You'll likely want to return the `instance` itself. But in some cases it might make sense to only expose some part of it.
  *
  * If you don't want to do anything here, return `instance`.
  */
  getPublicInstance: (instance) => {
    return instance?.leaflet as L.Map
  },

  /**
  * This method lets you store some information before React starts making changes to the tree on the screen. For example, the DOM renderer stores the current text selection so that it can later restore it. This method is mirrored by `resetAfterCommit`.
  *
  * Even if you don't want to do anything here, you need to return `null` from it.
  */
  prepareForCommit: (containerInfo) => {
    return null
  },

  /**
  * This method is called right after React has performed the tree mutations. You can use it to restore something you've stored in `prepareForCommit` — for example, text selection.
  *
  * You can leave it empty.
  */
  resetAfterCommit: (containerInfo) => {
    /** noop */
  },

  /**
   * This method is called for a container that's used as a portal target. Usually you can leave it empty.
   */
  preparePortalMount: (containerInfo) => {
    /** noop */
  },

  /**
   * You can proxy this to `performance.now()` or its equivalent in your environment.
   */
  now: () => { return performance.now() },

  /**
   * You can proxy this to `setTimeout` or its equivalent in your environment.
   */
  scheduleTimeout: (fn, delay) => {
    setTimeout(fn, delay)
  },

  /**
   * You can proxy this to `clearTimeout` or its equivalent in your environment.
   */
  cancelTimeout: (id) => {
    clearTimeout(id)
  },

  /**
   * This is a property (not a function) that should be set to something that can never be a valid timeout ID. For example, you can set it to `-1`.
   */
  noTimeout: -1,

  /**
  * This is a property (not a function) that should be set to `true` if your renderer is the main one on the page. For example, if you're writing a renderer for the Terminal, it makes sense to set it to `true`, but if your renderer is used *on top of* React DOM or some other existing renderer, set it to `false`.
  */
  isPrimaryRenderer: false,

  // -------------------
  //  Mutation Methods
  //    (optional)
  //  If you're using React in mutation mode (you probably do), you'll need to implement a few more methods.
  // -------------------

  /**
  * This method should mutate the `parentInstance` and add the child to its list of children. For example, in the DOM this would translate to a `parentInstance.appendChild(child)` call.
  *
  * Although this method currently runs in the commit phase, you still should not mutate any other nodes in it. If you need to do some additional work when a node is definitely connected to the visible tree, look at `commitMount`.
  */
  appendChild: (parentInstance, child) => {
    if (!parentInstance || !child) return

    child.parent = parentInstance

    switch (parentInstance?.category) {
      case 'map':
      case 'layergroup':
      case 'featuregroup':
        const parent = parentInstance.leaflet as L.Map | L.LayerGroup
        const layer = child?.leaflet as L.Layer

        parent.addLayer(layer)

        break
    }
  },

  /**
  * Same as `appendChild`, but for when a node is attached to the root container. This is useful if attaching to the root has a slightly different implementation, or if the root container nodes are of a different type than the rest of the tree.
  */
  appendChildToContainer: (container, child) => {
    // leaflet already does the attaching
    return null
  },

  /**
  * This method should mutate the `parentInstance` and place the `child` before `beforeChild` in the list of its children. For example, in the DOM this would translate to a `parentInstance.insertBefore(child, beforeChild)` call.
  *
  * Note that React uses this method both for insertions and for reordering nodes. Similar to DOM, it is expected that you can call `insertBefore` to reposition an existing child. Do not mutate any other parts of the tree from it.
  */
  insertBefore: (parentInstance, child, beforeChild) => {
    switch (parentInstance?.category) {
      case 'map':
      case 'layergroup':
      case 'featuregroup':
        const parent = parentInstance.leaflet as L.Map | L.LayerGroup
        const layer = child?.leaflet as L.Layer

        parent.addLayer(layer)

        // New layers are added on top so let's see if we can fix that, when they share the parent element.
        // Sometimes they do not since leaflet layer insertions do not match JSX defs.
        // E.g. all lfCircle are added to a common <svg> element so if we place one next to a lfTileLayer,
        // then they will be added to different DOM elements and insertBefore is meaningless
        const childAny = child?.leaflet as any
        const beforeChildAny = beforeChild?.leaflet as any
        const element = childAny.getElement ? childAny.getElement() : childAny.getContainer ? childAny.getContainer : null
        const elementBefore = beforeChildAny.getElement ? beforeChildAny.getElement() : beforeChildAny.getContainer ? beforeChildAny.getContainer : null

        if (element && elementBefore && element.parentNode === elementBefore.parentNode) {
          element.parentNode?.removeChild(element)
          elementBefore.parentNode?.insertBefore(element, elementBefore)
        }

        break
    }
  },

  /**
  * Same as `insertBefore`, but for when a node is attached to the root container. This is useful if attaching to the root has a slightly different implementation, or if the root container nodes are of a different type than the rest of the tree.
  */
  // insertInContainerBefore: (container, child, beforeChild) => { },

  /**
  * This method should mutate the `parentInstance` to remove the `child` from the list of its children.
  *
  * React will only call it for the top-level node that is being removed. It is expected that garbage collection would take care of the whole subtree. You are not expected to traverse the child tree in it.
  */
  removeChild: (parentInstance, child) => {
    switch (parentInstance?.category) {
      case 'map':
      case 'layergroup':
      case 'featuregroup':
        const parent = parentInstance.leaflet as L.Map | L.LayerGroup
        const layer = child?.leaflet as L.Layer
        parent.removeLayer(layer)
        break
    }
  },

  /**
  * Same as `removeChild`, but for when a node is detached from the root container. This is useful if attaching to the root has a slightly different implementation, or if the root container nodes are of a different type than the rest of the tree.
  */
  removeChildFromContainer: (container, child) => {
    const map = child?.leaflet as L.Map
    map?.remove()
  },

  /**
  * If you returned `true` from `shouldSetTextContent` for the previous props, but returned `false` from `shouldSetTextContent` for the next props, React will call this method so that you can clear the text content you were managing manually. For example, in the DOM you could set `node.textContent = ''`.
  *
  * If you never return `true` from `shouldSetTextContent`, you can leave it empty.
  */
  // resetTextContent: (instance) => { },

  /**
   * This method should mutate the `textInstance` and update its text content to `nextText`.
   *
   * Here, `textInstance` is a node created by `createTextInstance`.
   */
  // commitTextUpdate: (textInstance, oldText, newText) => { },

  /**
  * This method is only called if you returned `true` from `finalizeInitialChildren` for this instance.
  *
  * It lets you do some additional work after the node is actually attached to the tree on the screen for the first time. For example, the DOM renderer uses it to trigger focus on nodes with the `autoFocus` attribute.
  *
  * Note that `commitMount` does not mirror `removeChild` one to one because `removeChild` is only called for the top-level removed node. This is why ideally `commitMount` should not mutate any nodes other than the `instance` itself. For example, if it registers some events on some node above, it will be your responsibility to traverse the tree in `removeChild` and clean them up, which is not ideal.
  *
  * The `internalHandle` data structure is meant to be opaque. If you bend the rules and rely on its internal fields, be aware that it may change significantly between versions. You're taking on additional maintenance risk by reading from it, and giving up all guarantees if you write something to it.
  *
  * If you never return `true` from `finalizeInitialChildren`, you can leave it empty.
  */
  commitMount: (instance, type, props, internalInstanceHandle) => {
    switch (instance?.parent?.category) {
      case 'map': {
        // popup as a layer
        if (instance.type === 'lfPopup') {
          const popup = instance?.leaflet as L.Popup
          const popupProps = instance?.props as LeafletIntrinsicElements['lfPopup']
          const parent = instance.parent.leaflet as L.Map

          if (popupProps.latlng) {
            popup.setLatLng(popupProps.latlng)

            if (popupProps.isOpen) {
              popup.openPopup()
            }
          }

          // TODO: what about click event handlers on the map or popup itself? this seeems to be a single handler for a single event
          parent.on('click', (e: L.LeafletMouseEvent) => {
            if (!popupProps.latlng) {
              popup.setLatLng(e.latlng)
            }

            popup.openOn(parent)
          })
        }

        break
      }

      case 'layer':
      case 'layergroup':
      case 'featuregroup': {
        // popup as an attachment
        if (instance.type === 'lfPopup') {
          const popup = instance?.leaflet as L.Popup
          const popupProps = instance?.props as LeafletIntrinsicElements['lfPopup']
          const parent = instance?.parent?.leaflet as L.Layer
          parent.bindPopup(popup, popupProps.options)

          if (popupProps.isOpen) {
            popup.openPopup()
          }
        }

        // tooltip as an attachment
        if (instance.type === 'lfTooltip') {
          const tooltip = instance?.leaflet as L.Tooltip
          const tooltipProps = instance?.props as LeafletIntrinsicElements['lfTooltip']
          const parent = instance?.parent?.leaflet as L.Layer
          parent.bindTooltip(tooltip, tooltipProps.options)

          if (tooltipProps.isOpen) {
            tooltip.openTooltip()
          }
        }

        break
      }
    }
  },

  /**
  * This method should mutate the `instance` according to the set of changes in `updatePayload`. Here, `updatePayload` is the object that you've returned from `prepareUpdate` and has an arbitrary structure that makes sense for your renderer. For example, the DOM renderer returns an update payload like `[prop1, value1, prop2, value2, ...]` from `prepareUpdate`, and that structure gets passed into `commitUpdate`. Ideally, all the diffing and calculation should happen inside `prepareUpdate` so that `commitUpdate` can be fast and straightforward.
  *
  * The `internalHandle` data structure is meant to be opaque. If you bend the rules and rely on its internal fields, be aware that it may change significantly between versions. You're taking on additional maintenance risk by reading from it, and giving up all guarantees if you write something to it.
  */
  commitUpdate: (instance, updatePayload, type, prevProps, nextProps, internalHandle) => {
    const map = maps.get(updatePayload.rootContainer)

    if (!map) {
      throw Error(`leaflet-react-fibers: Did not find a map while updating instance of type "${type}" and category of "${instance?.category}"`)
    }

    switch (instance?.category) {
      case 'map': {
        map.options = { ...prevProps.options as L.MapOptions, ...nextProps.options as L.MapOptions }
        map.invalidateSize({ animate: false })
        break
      }

      case 'handler': {
        const parent = map as L.Map & { [key: string]: L.Handler }
        const props = nextProps as LeafletExtensions.Handler

        if (props.enabled) {
          parent[props.name].enable()
        } else {
          parent[props.name].disable()
        }

        break
      }

      case 'layer':
      case 'layergroup':
      case 'featuregroup': {
        const layer = instance?.leaflet as L.Layer & Partial<LeafletExtensions.Stateful<any>>

        // special case of attached popup
        if (instance.type === 'lfPopup') {
          const popup = instance.leaflet as L.Popup
          const popupProps = nextProps as LeafletIntrinsicElements['lfPopup']

          if (popupProps.latlng) {
            popup.setLatLng(popupProps.latlng)
          }

          if (instance.parent?.category === 'map') {
            const parent = instance.parent?.leaflet as L.Map

            if (popupProps.isOpen) {
              parent.openPopup(popup)
            } else {
              parent.closePopup(popup)
            }
          } else {
            const parent = instance.parent?.leaflet as L.Layer

            if (popupProps.isOpen) {
              parent.openPopup()
            } else {
              parent.closePopup()
            }
          }
        } else {
          if (instance.parent?.category === 'map' || instance.parent?.category === 'featuregroup' || instance.parent?.category === 'layergroup') {
            const parent = instance.parent?.leaflet as L.Map | L.FeatureGroup | L.LayerGroup
            const newInstance = createInstance(type, nextProps, updatePayload.rootContainer, updatePayload.hostContext, internalHandle)

            if (newInstance) {
              const newLayer = newInstance.leaflet as L.Layer & Partial<LeafletExtensions.Stateful<any>>
              const layerProps = nextProps as LeafletExtensions.Layer

              // stateful layer, default behavior
              if (!layerProps.hasOwnProperty('mutable') || layerProps.mutable) {
                if (layer.getState && newLayer.setState) {
                  const oldState = layer.getState()
                  newLayer.setState(oldState)
                }

                parent.removeLayer(layer)
                parent.addLayer(newLayer)
              }
              // standard layer
              else {
                // not much can change after layer is created, note that popups and tooltips are handled via JSX directly
              }

              instance.leaflet = newInstance.leaflet
            }
          }
        }

        break
      }

      case 'control': {
        const parent = instance.parent?.leaflet as L.Map
        const control = instance?.leaflet as L.Control & Partial<LeafletExtensions.Stateful<any>>
        const controlProps = nextProps as LeafletExtensions.Control['params']
        const newInstance = createInstance(type, nextProps, updatePayload.rootContainer, updatePayload.hostContext, internalHandle)

        if (newInstance) {
          const newControl = newInstance.leaflet as L.Control & Partial<LeafletExtensions.Stateful<any>>

          // stateful control, default behavior
          if (!controlProps.hasOwnProperty('mutable') || controlProps.mutable) {
            if (control.getState && newControl.setState) {
              const oldState = control.getState()
              newControl.setState(oldState)
            }

            parent.removeControl(control)
            parent.addControl(newControl)
          }
          // standard control
          else {
            control.setPosition(controlProps.position)
          }

          instance.leaflet = newInstance.leaflet
        }

        break
      }
    }
  },

  /**
  * This method should make the `instance` invisible without removing it from the tree. For example, it can apply visual styling to hide it. It is used by Suspense to hide the tree while the fallback is visible.
  */
  // hideInstance: (instance) => { },

  /**
   * Same as `hideInstance`, but for nodes created by `createTextInstance`.
   */
  // hideTextInstance: (textInstance) => { },

  /**
   * This method should make the `instance` visible, undoing what `hideInstance` did.
   */
  // unhideInstance: (instance, props) => { },

  /**
   * Same as `unhideInstance`, but for nodes created by `createTextInstance`.
   */
  // unhideTextInstance: (textInstance, text) => { },

  /**
   * This method should mutate the `container` root node and remove all children from it.
   */
  clearContainer: (container) => {
    /** noop */
  },

  // -------------------
  // Hydration Methods
  //    (optional)
  // You can optionally implement hydration to "attach" to the existing tree during the initial render instead of creating it from scratch. For example, the DOM renderer uses this to attach to an HTML markup.
  //
  // To support hydration, you need to declare `supportsHydration: true` and then implement the methods in the "Hydration" section [listed in this file](https://github.com/facebook/react/blob/master/packages/react-reconciler/src/forks/ReactFiberHostConfig.custom.js). File an issue if you need help.
  // -------------------

  supportsHydration: false

  // canHydrateInstance: (instance, type, props) => { },

  // canHydrateTextInstance: (instance, text) => { },

  // canHydrateSuspenseInstance: (instance) => { },

  // isSuspenseInstancePending: (instance) => { },

  // isSuspenseInstanceFallback: (instance) => { },

  // registerSuspenseInstanceRetry: (instance, callback) => { },

  // getNextHydratableSibling: (instance) => { },

  // getFirstHydratableChild: (parentInstance) => { },

  // hydrateInstance: (instance, type, props, rootContainerInstance, hostContext, internalInstanceHandle) => { },

  // hydrateTextInstance: (textInstance, text, internalInstanceHandle) => { },

  // hydrateSuspenseInstance: (suspenseInstance, internalInstanceHandle) => { },

  // getNextHydratableInstanceAfterSuspenseInstance: (suspenseInstance) => { },

  // // Returns the SuspenseInstance if this node is a direct child of a
  // // SuspenseInstance. I.e. if its previous sibling is a Comment with
  // // SUSPENSE_x_START_DATA. Otherwise, null.
  // getParentSuspenseInstance: (targetInstance) => { },

  // commitHydratedContainer: (container) => { },

  // commitHydratedSuspenseInstance: (suspenseInstance) => { },

  // didNotMatchHydratedContainerTextInstance: (parentContainer, textInstance, text) => { },

  // didNotMatchHydratedTextInstance: (parentType, parentProps, parentInstance, textInstance, text) => { },

  // didNotHydrateContainerInstance: (parentContainer, instance) => { },

  // didNotHydrateInstance: (parentType, parentProps, parentInstance, instance) => { },

  // didNotFindHydratableContainerInstance: (parentContainer, type, props) => { },

  // didNotFindHydratableContainerTextInstance: (parentContainer, text) => { },

  // didNotFindHydratableContainerSuspenseInstance: (parentContainer) => { },

  // didNotFindHydratableInstance: (parentType, parentProps, parentInstance, type, props) => { },

  // didNotFindHydratableTextInstance: (parentType, parentProps, parentInstance, text) => { },

  // didNotFindHydratableSuspenseInstance: (parentType, parentProps, parentInstance) => { },

}

const setProps = function <P extends { [key: string]: any }>(leaflet: L.Class & { [key: string]: any }, props: P) {
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

const propsChanged = (oldProps: Props, nextProps: Props) => {
  const isEqual = isEqualWith(oldProps, nextProps, (a: any, b: any) => {
    // non-memoized functions should not result in layer re-renders, compare function bodies instead
    if (isFunction(a) || isFunction(b)) {
      return a.toString() === b.toString()
    }
  })
  return !isEqual
}

const renderer = ReactReconciler(hostConfig)
export default {
  render: (reactElement: React.ReactNode, domElement: HTMLDivElement, jsxRenderer?: JSXRenderer, callback?: () => void) => {
    contentRenderer = jsxRenderer
    let container
    if (instances.has(domElement)) {
      container = instances.get(domElement)
    } else {
      container = renderer.createContainer(domElement, 1, false, { onDeleted: callback, onHydrated: callback })
      instances.set(domElement, container)
    }

    renderer.updateContainer(reactElement, container, null, callback)
  }
}
