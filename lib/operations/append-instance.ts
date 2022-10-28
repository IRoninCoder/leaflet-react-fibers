import L from 'leaflet'

import { LeafletExtensions, LeafletIntrinsicElements } from '../catalog'
import { Instance } from '../renderer-types'

const appendInstance = (parentInstance: Instance, childInstance: Instance) => {
  if (!childInstance) return

  // Sync parent instance for future reference
  childInstance.parent = parentInstance || childInstance.parent

  if (childInstance.parent?.category === 'map' && childInstance.category === 'handler') {
    const parent = childInstance.parent.leaflet as L.Map & { [key: string]: L.Handler }
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

  switch (childInstance.parent?.category) {
    case 'layergroup':
    case 'featuregroup':
    case 'layer': {
      switch (childInstance.type) {
        // attached popup
        case 'lfPopup': {
          const popup = childInstance.leaflet as L.Popup
          const popupProps = childInstance.props as LeafletIntrinsicElements['lfPopup']
          const parent = childInstance.parent?.leaflet as L.Layer
          parent.bindPopup(popup, popupProps.options)

          if (popupProps.isOpen) {
            popup.openPopup()
          } else {
            popup.closePopup()
          }

          break
        }

        // attached tooltip
        case 'lfTooltip': {
          const tooltip = childInstance.leaflet as L.Tooltip
          const tooltipProps = childInstance.props as LeafletIntrinsicElements['lfTooltip']
          const parent = childInstance.parent?.leaflet as L.Layer
          parent.bindTooltip(tooltip, tooltipProps.options)

          if (tooltipProps.isOpen) {
            tooltip.openTooltip()
          } else {
            tooltip.closeTooltip()
          }

          break
        }

        default: {
          const child = childInstance.leaflet as L.Layer
          const parent = childInstance.parent.leaflet as L.LayerGroup
          child.addTo(parent)

          break
        }
      }

      break
    }

    case 'map': {
      const parent = childInstance.parent.leaflet as L.Map

      switch (childInstance.type) {
        // popup as layer
        case 'lfPopup': {
          const popup = childInstance.leaflet as L.Popup
          const popupProps = childInstance.props as LeafletIntrinsicElements['lfPopup']
          const parent = childInstance.parent?.leaflet as L.Map

          if (popupProps.latlng) {
            popup.setLatLng(popupProps.latlng)

            if (popupProps.isOpen) {
              popup.openPopup()
            }
          }

          parent.on('click', (e: L.LeafletMouseEvent) => {
            if (!popupProps.latlng) {
              popup.setLatLng(e.latlng)
            }

            popup.openOn(parent)
          })

          break
        }

        default: {
          const child = childInstance.leaflet as L.Layer | L.Control
          child.addTo(parent)

          break
        }
      }

      break
    }
  }
}

export default appendInstance
