import { HostConfig } from 'react-reconciler'
import L from 'leaflet'

import { LeafletIntrinsicElements } from './catalog'

export type ElementType = keyof LeafletIntrinsicElements

export type ElementProps = LeafletIntrinsicElements[ElementType]

export type Container = HTMLDivElement

export type HostContext = Record<string, unknown>

export type UpdatePayload = {
  rootContainer: Container
  hostContext: HostContext
}

export type Instance = {
  type: ElementType
  category: 'map' | 'layergroup' | 'featuregroup' | 'layer' | 'control' | 'handler'
  leaflet: L.Class
  props: unknown
  parent?: Instance
} | undefined

export type RenderHostConfigs = HostConfig<
  ElementType,
  ElementProps,
  Container,
  Instance,
  Instance,
  Instance,
  Instance,
  L.Map,
  HostContext,
  UpdatePayload,
  any,
  any,
  any
>
