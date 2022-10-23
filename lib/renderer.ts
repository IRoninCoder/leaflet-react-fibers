import ReactReconciler from 'react-reconciler'
import L from 'leaflet'
import { isEqualWith, isFunction, noop } from 'lodash'

import { JSXRenderer, LeafletIntrinsicElements } from './catalog'
import { ElementProps, RenderHostConfigs } from './types'
import { Add, Remove } from './cache'
import TryReplace from './try-replace'

import CreateInstance from './operations/create-instance'
import CommitUpdate from './operations/commit-update'
import AppendInstance from './operations/append-instance'

const hostConfig: RenderHostConfigs = {
  supportsMutation: true,
  supportsPersistence: false,

  createInstance: CreateInstance,

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
  appendInitialChild: AppendInstance,

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
    let isMutable: boolean | undefined = true

    // Mutable, default behavior
    if (Object.prototype.hasOwnProperty.call(newProps, 'mutable')) {
      isMutable = isMutable && newProps.mutable
    }
    // Verify if a parent group is mutable
    if (instance?.parent?.category === 'layergroup' || instance?.parent?.category === 'featuregroup') {
      const groupProps = instance.parent.props as LeafletIntrinsicElements['lfLayerGroup'] | LeafletIntrinsicElements['lfFeatureGroup']

      if (Object.prototype.hasOwnProperty.call(groupProps, 'mutable')) {
        isMutable = isMutable && groupProps.mutable
      }
    }
    // TODO: BUG mutability is just broken. Also updating color of wyoming will shift it to the top of z-axis.
    if (isMutable && propsChanged(oldProps, newProps)) {
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
  appendChild: (parentInstance, childInstance) => {
    if (!childInstance) return

    // Sync parent for future reference
    childInstance.parent = parentInstance || childInstance.parent

    AppendInstance(parentInstance, childInstance)
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
  insertBefore: (parentInstance, childInstance, beforeChild) => {
    if (!childInstance) return

    // Sync parent for future reference
    childInstance.parent = parentInstance || childInstance.parent

    // Add the layer
    AppendInstance(parentInstance, childInstance)

    // Reorder the DOM, if possible
    TryReplace(childInstance, beforeChild)
  },

  /**
  * This method should mutate the `parentInstance` to remove the `child` from the list of its children.
  *
  * React will only call it for the top-level node that is being removed. It is expected that garbage collection would take care of the whole subtree. You are not expected to traverse the child tree in it.
  */
  removeChild: (parentInstance, child) => {
    switch (parentInstance?.category) {
      case 'map':
      case 'layergroup':
      case 'featuregroup': {
        const parent = parentInstance.leaflet as L.Map | L.LayerGroup
        const layer = child?.leaflet as L.Layer
        parent.removeLayer(layer)

        break
      }
    }
  },

  /**
  * Same as `removeChild`, but for when a node is detached from the root container. This is useful if attaching to the root has a slightly different implementation, or if the root container nodes are of a different type than the rest of the tree.
  */
  removeChildFromContainer: (container, child) => {
    const map = child?.leaflet as L.Map
    Remove(container)
    map?.remove()
  },

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
    if (!instance) return

    // Apply HTML-like attributes, if any
    const leaflet = instance.leaflet as L.Layer & { getElement?: () => Element | null | undefined, getContainer?: () => Element | null | undefined }
    const layer$ = leaflet.getElement ? leaflet.getElement() : leaflet.getContainer ? leaflet.getContainer() : null
    if (layer$) {
      for (const key in props) {
        // Prop key is acceptable. Only a handful are acceptable. This is to prevent collision with leaflet attributes
        if ([/data-.+/i, /id/i, /name/i, /aria-.+/i].some((regex) => regex.test(key))) {
          layer$.setAttributeNS(null, key, props[key])
        }
      }
    }
  },

  /**
  * This method should mutate the `instance` according to the set of changes in `updatePayload`. Here, `updatePayload` is the object that you've returned from `prepareUpdate` and has an arbitrary structure that makes sense for your renderer. For example, the DOM renderer returns an update payload like `[prop1, value1, prop2, value2, ...]` from `prepareUpdate`, and that structure gets passed into `commitUpdate`. Ideally, all the diffing and calculation should happen inside `prepareUpdate` so that `commitUpdate` can be fast and straightforward.
  *
  * The `internalHandle` data structure is meant to be opaque. If you bend the rules and rely on its internal fields, be aware that it may change significantly between versions. You're taking on additional maintenance risk by reading from it, and giving up all guarantees if you write something to it.
  */
  commitUpdate: CommitUpdate,

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
}

const propsChanged = (oldProps: ElementProps, nextProps: ElementProps) => {
  const isEqual = isEqualWith(oldProps, nextProps, (a: any, b: any) => {
    // non-memoized functions should not result in layer re-renders, compare function bodies instead
    if (isFunction(a) || isFunction(b)) {
      return a.toString() === b.toString()
    }
  })
  return !isEqual
}

const instances = new Map<HTMLElement, ReactReconciler.FiberRoot>()
const renderer = ReactReconciler(hostConfig)

export default {
  render: (reactElement: globalThis.React.ReactNode, domElement: HTMLDivElement, jsxRenderer?: JSXRenderer, callback?: () => void) => {
    Add('jsxRenderer', jsxRenderer)

    let container
    if (instances.has(domElement)) {
      container = instances.get(domElement)
    } else {
      container = renderer.createContainer(domElement, 1, null, false, null, 'leafletReactFibers', noop, null)
      instances.set(domElement, container)
    }

    renderer.updateContainer(reactElement, container, null, callback)
  }
}
