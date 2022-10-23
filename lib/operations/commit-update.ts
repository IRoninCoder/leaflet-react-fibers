
import { OpaqueHandle } from 'react-reconciler'
import L from 'leaflet'

import { Get } from '../cache'
import { LeafletExtensions, LeafletIntrinsicElements } from '../catalog'
import { Instance, ElementType, UpdatePayload, ElementProps } from '../renderer-types'
import CreateInstance from './create-instance'
import { TryReorder } from '../dom-helper'

/** Switch popup/tooltip bindings to a new layer */
const tryTransferLayerAdditions = (layer: L.Layer, newLayer: L.Layer) => {
  const popup = layer.getPopup()
  const tooltip = layer.getTooltip()
  if (popup) {
    layer.unbindPopup()
    newLayer.bindPopup(popup)
  }
  if (tooltip) {
    layer.unbindTooltip()
    newLayer.bindTooltip(tooltip)
  }
}

/**
* This method should mutate the `instance` according to the set of changes in `updatePayload`. Here, `updatePayload` is the object that you've returned from `prepareUpdate` and has an arbitrary structure that makes sense for your renderer. For example, the DOM renderer returns an update payload like `[prop1, value1, prop2, value2, ...]` from `prepareUpdate`, and that structure gets passed into `commitUpdate`. Ideally, all the diffing and calculation should happen inside `prepareUpdate` so that `commitUpdate` can be fast and straightforward.
*
* The `internalHandle` data structure is meant to be opaque. If you bend the rules and rely on its internal fields, be aware that it may change significantly between versions. You're taking on additional maintenance risk by reading from it, and giving up all guarantees if you write something to it.
*/
const commitUpdate = (instance: Instance, updatePayload: UpdatePayload, type: ElementType, prevProps: ElementProps, nextProps: ElementProps, internalHandle: OpaqueHandle) => {
  const map = Get<HTMLElement, L.Map>(updatePayload.rootContainer)

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
      const layer = instance?.leaflet as L.Layer & Partial<LeafletExtensions.Statefull<any>>

      switch (instance.type) {
        // special case of attached popup
        case 'lfPopup': {
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

          break
        }

        default: {
          if (!instance.parent) break

          const parent = instance.parent?.leaflet as L.Map | L.FeatureGroup | L.LayerGroup
          const mutableNextProps = { ...nextProps }

          // Transfers existing layers from current group to new group
          if (instance.category === 'layergroup' || instance.category === 'featuregroup') {
            mutableNextProps.layers = (layer as L.FeatureGroup | L.LayerGroup).getLayers()
          }

          const newInstance = CreateInstance(type, mutableNextProps, updatePayload.rootContainer, updatePayload.hostContext, internalHandle)

          if (!newInstance) break

          const newLayer = newInstance.leaflet as L.Layer & Partial<LeafletExtensions.Statefull<any>>

          // Stateful layer
          if (layer.getState && newLayer.setState) {
            const oldState = layer.getState()
            newLayer.setState(oldState)
          }

          // Add new layer
          parent.addLayer(newLayer)

          // Configure new layer using the old layer
          tryTransferLayerAdditions(layer, newLayer)
          TryReorder(newInstance, instance)

          // Remove old layer when it is not a group because groups do not have a DOM. Remove on a group is a proxy call to remove layers
          if (instance.category !== 'layergroup' && instance.category !== 'featuregroup') {
            parent.removeLayer(layer)
          }

          instance.leaflet = newInstance.leaflet

          break
        }
      }

      break
    }

    case 'control': {
      const parent = instance.parent?.leaflet as L.Map
      const control = instance?.leaflet as L.Control & Partial<LeafletExtensions.Statefull<any>>
      const newInstance = CreateInstance(type, nextProps, updatePayload.rootContainer, updatePayload.hostContext, internalHandle)

      if (newInstance) {
        const newControl = newInstance.leaflet as L.Control & Partial<LeafletExtensions.Statefull<any>>

        // statefull control
        if (control.getState && newControl.setState) {
          const oldState = control.getState()
          newControl.setState(oldState)
        }

        parent.removeControl(control)
        parent.addControl(newControl)

        instance.leaflet = newInstance.leaflet
      }

      break
    }
  }
}

export default commitUpdate
