import { Instance } from './types'

/**
 * Replace a DOM element in-place. Returns true when in-place replacement is successful.
 * In some cases it is not possible because leaflet adds layers to different DOM elements.
*/
const tryReplace = (childInstance: Instance, beforeChild: Instance) => {
  let didReplace = false

  if (childInstance?.parent && childInstance?.parent === beforeChild?.parent) {
    const childAny = childInstance?.leaflet as any
    const beforeChildAny = beforeChild?.leaflet as any
    const element: HTMLElement = childAny?.getContainer ? childAny.getContainer() : childAny?.getElement ? childAny.getElement() : null
    const elementBefore: HTMLElement = beforeChildAny?.getContainer ? beforeChildAny.getContainer() : beforeChildAny?.getElement ? beforeChildAny.getElement() : null

    if (element && elementBefore && element.parentElement && element.parentElement === elementBefore.parentElement) {
      element.parentElement.removeChild(element)
      elementBefore.parentElement.insertBefore(element, elementBefore)

      didReplace = true
    }
  }

  return didReplace
}

export default tryReplace
