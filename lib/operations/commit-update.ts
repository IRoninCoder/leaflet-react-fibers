
import { OpaqueHandle } from 'react-reconciler'
import L from 'leaflet'

import { Get } from '../cache'
import { LeafletExtensions, LeafletIntrinsicElements } from '../catalog'
import { Instance, ElementType, UpdatePayload, ElementProps } from '../types'
import createInstance from './create-instance'

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
            const newLayer = newInstance.leaflet as L.Layer & Partial<LeafletExtensions.Statefull<any>>
            const layerProps = nextProps as LeafletExtensions.Layer

            if (!Object.prototype.hasOwnProperty.call(layerProps, 'mutable') || layerProps.mutable) {
              // Statefull layer or mutable explicitly, default behavior
              if (layer.getState && newLayer.setState) {
                const oldState = layer.getState()
                newLayer.setState(oldState)
              }

              // Refresh layer
              parent.removeLayer(layer)
              parent.addLayer(newLayer)
            } else {
              // Standard layer, not marked as mutable
              // Not much can change after layer is created because leaflet is immutable. Note that popups and tooltips are handled via JSX directly
            }

            instance.leaflet = newInstance.leaflet
          }
        }
      }

      break
    }

    case 'control': {
      const parent = instance.parent?.leaflet as L.Map
      const control = instance?.leaflet as L.Control & Partial<LeafletExtensions.Statefull<any>>
      const controlProps = nextProps as LeafletExtensions.Control['params']
      const newInstance = createInstance(type, nextProps, updatePayload.rootContainer, updatePayload.hostContext, internalHandle)

      if (newInstance) {
        const newControl = newInstance.leaflet as L.Control & Partial<LeafletExtensions.Statefull<any>>

        if (!Object.prototype.hasOwnProperty.call(controlProps, 'mutable') || controlProps.mutable) {
          // statefull control, default behavior

          if (control.getState && newControl.setState) {
            const oldState = control.getState()
            newControl.setState(oldState)
          }

          parent.removeControl(control)
          parent.addControl(newControl)
        } else {
          // standard control
          control.setPosition(controlProps.position)
        }

        instance.leaflet = newInstance.leaflet
      }

      break
    }
  }
}

export default commitUpdate
