import L from 'leaflet'
import { GeoJsonObject } from 'geojson'

/** React standard event names as opposed to leaflet's L.LeafletEventHandlerFnMap */
export interface LeafletReactFiberEvents {
  onBaseLayerChange?: L.LayersControlEventHandlerFn | undefined;
  onOverlayAdd?: L.LayersControlEventHandlerFn | undefined;
  onOverlayRemove?: L.LayersControlEventHandlerFn | undefined;

  onLayerAdd?: L.LayerEventHandlerFn | undefined;
  onLayerRemove?: L.LayerEventHandlerFn | undefined;

  onZoomLevelsChange?: L.LeafletEventHandlerFn | undefined;
  onUnload?: L.LeafletEventHandlerFn | undefined;
  onViewReset?: L.LeafletEventHandlerFn | undefined;
  onLoad?: L.LeafletEventHandlerFn | undefined;
  onZoomStart?: L.LeafletEventHandlerFn | undefined;
  onMoveStart?: L.LeafletEventHandlerFn | undefined;
  onZoom?: L.LeafletEventHandlerFn | undefined;
  onMove?: L.LeafletEventHandlerFn | undefined;
  onZoomEnd?: L.LeafletEventHandlerFn | undefined;
  onMoveEnd?: L.LeafletEventHandlerFn | undefined;
  onAutopanStart?: L.LeafletEventHandlerFn | undefined;
  onDragStart?: L.LeafletEventHandlerFn | undefined;
  onDrag?: L.LeafletEventHandlerFn | undefined;
  onAdd?: L.LeafletEventHandlerFn | undefined;
  onRemove?: L.LeafletEventHandlerFn | undefined;
  onLoading?: L.LeafletEventHandlerFn | undefined;
  onError?: L.LeafletEventHandlerFn | undefined;
  onUpdate?: L.LeafletEventHandlerFn | undefined;
  onDown?: L.LeafletEventHandlerFn | undefined;
  onPreDrag?: L.LeafletEventHandlerFn | undefined;

  onResize?: L.ResizeEventHandlerFn | undefined;

  onPopupOpen?: L.PopupEventHandlerFn | undefined;
  onPopupClose?: L.PopupEventHandlerFn | undefined;

  onTooltipOpen?: L.TooltipEventHandlerFn | undefined;
  onTooltipClose?: L.TooltipEventHandlerFn | undefined;

  onLocationError?: L.ErrorEventHandlerFn | undefined;

  onLocationFound?: L.LocationEventHandlerFn | undefined;

  onClick?: L.LeafletMouseEventHandlerFn | undefined;
  onDblClick?: L.LeafletMouseEventHandlerFn | undefined;
  onMouseDown?: L.LeafletMouseEventHandlerFn | undefined;
  onMouseUp?: L.LeafletMouseEventHandlerFn | undefined;
  onMouseOver?: L.LeafletMouseEventHandlerFn | undefined;
  onMouseOut?: L.LeafletMouseEventHandlerFn | undefined;
  onMouseMove?: L.LeafletMouseEventHandlerFn | undefined;
  onContextMenu?: L.LeafletMouseEventHandlerFn | undefined;
  onPreClick?: L.LeafletMouseEventHandlerFn | undefined;

  onKeyPress?: L.LeafletKeyboardEventHandlerFn | undefined;
  onKeyDown?: L.LeafletKeyboardEventHandlerFn | undefined;
  onKeyUp?: L.LeafletKeyboardEventHandlerFn | undefined;

  onZoomAnim?: L.ZoomAnimEventHandlerFn | undefined;

  onDragEnd?: L.DragEndEventHandlerFn | undefined;

  onTileUnload?: L.TileEventHandlerFn | undefined;
  onTileLoadStart?: L.TileEventHandlerFn | undefined;
  onTileLoad?: L.TileEventHandlerFn | undefined;

  onTileError?: L.TileErrorEventHandlerFn | undefined;
}

/** A single child with optional properties */
export type Child<T> = globalThis.React.ReactElement<Partial<{ [K in keyof T]: T[K] }>> | null | undefined | never | boolean
/** One or more JSX children elements */
export type IntrinsicElementChildren<T> = { children?: Child<T> | Child<T>[] }
/** One JSX children elements */
export type IntrinsicElementChild<T> = { children?: Child<T> }

export interface IntrinsicLayerAdditions extends globalThis.JSX.Element {
  /** A leaflet popup */
  lfPopup: { options?: L.PopupOptions, source?: L.Layer, children: globalThis.JSX.Element, latlng?: L.LatLngExpression, isOpen?: boolean } & LeafletReactFiberEvents
  /** A leaflet tooltip */
  lfTooltip: { options?: L.TooltipOptions, source?: L.Layer, children: globalThis.JSX.Element, isOpen?: boolean } & LeafletReactFiberEvents
}

/** Common types for all layer JSX elements */
export type LayerElementCommon<T> = globalThis.React.RefAttributes<T> & IntrinsicElementChildren<IntrinsicLayerAdditions> & LeafletReactFiberEvents & { mutable?: boolean }

/** Intrinsic layer defintions to extend JSX */
export interface IntrinsicLayers extends globalThis.JSX.Element {
  /** A leaflet image layer */
  lfImage: { imageUrl: string, bounds: L.LatLngBoundsExpression, options?: L.ImageOverlayOptions } & LayerElementCommon<L.ImageOverlay>
  /** A leaflet rectangle layer */
  lfRectangle: { bounds: L.LatLngBoundsExpression, options?: L.PolylineOptions } & LayerElementCommon<L.Rectangle>
  /** A leaflet marker */
  lfMarker: { latlng: L.LatLngExpression, options?: L.MarkerOptions, iconOptions?: Partial<L.IconOptions> } & LayerElementCommon<L.Marker>
  /** A leaflet tile layer */
  lfTiles: { urlTemplate: string, options?: L.TileLayerOptions } & LayerElementCommon<L.TileLayer>
  /** A leaflet WMS layer */
  lfTilesWMS: { baseUrl: string, options: L.WMSOptions } & LayerElementCommon<L.TileLayer.WMS>
  /** A leaflet video layer */
  lfVideo: { video: string | string[] | HTMLVideoElement, bounds: L.LatLngBoundsExpression, options?: L.VideoOverlayOptions } & LayerElementCommon<L.VideoOverlay>
  /** A leaflet polyline layer */
  lfPolyline: { latlngs: L.LatLngExpression[] | L.LatLngExpression[][] | L.LatLngExpression[][][], options?: L.PolylineOptions } & LayerElementCommon<L.Polyline>
  /** A leaflet polygon layer */
  lfPolygon: { latlngs: L.LatLngExpression[] | L.LatLngExpression[][] | L.LatLngExpression[][][], options?: L.PolylineOptions } & LayerElementCommon<L.Polygon>
  /** A leaflet circle layer */
  lfCircle: { latlng: L.LatLngExpression, options?: L.CircleMarkerOptions } & LayerElementCommon<L.Circle>
  /** A leaflet circle marker layer */
  lfCircleMarker: { latlng: L.LatLngExpression, options?: L.CircleMarkerOptions } & LayerElementCommon<L.CircleMarker>
  /** A leaflet svg layer */
  lfSVG: { svgImage: string | SVGElement, bounds: L.LatLngBoundsExpression, options?: L.ImageOverlayOptions } & LayerElementCommon<L.SVGOverlay>
  /** A leaflet geojson layer */
  lfGeoJSON: { geojson?: GeoJsonObject & { [key: string]: any }, options?: L.GeoJSONOptions<any> } & LayerElementCommon<L.GeoJSON>
  /** A leaflet grid layer */
  lfGridLayer: { options?: L.GridLayerOptions } & LeafletReactFiberEvents
}

export interface IntrinsicGroups extends globalThis.JSX.Element {
  /** A leaflet layergroup */
  lfLayerGroup: { layers?: L.Layer[], options?: L.LayerOptions, mutable?: boolean } & LeafletReactFiberEvents & IntrinsicElementChildren<IntrinsicLayerAdditions> & IntrinsicElementChildren<IntrinsicLayers>
  /** A leaflet featuregroup layer */
  lfFeatureGroup: { layers?: L.Layer[], options?: L.LayerOptions, mutable?: boolean } & LeafletReactFiberEvents & IntrinsicElementChildren<IntrinsicLayerAdditions> & IntrinsicElementChildren<IntrinsicLayers>
}

/** A render function capable of rendering standard JSX E.g. ReactDom.render */
export type JSXRenderer = (element: globalThis.JSX.Element, container: HTMLElement) => HTMLElement

/** Leaflet customization types. Use them to help with augmenting the JSX namespace */
export namespace LeafletExtensions {
  /** Updatable class constructore wrapper type E.g.
   * ```ts
   * constructor(params: Updatable<MyClassParams>) { }
   * ```
   * */
  export type Updatable<Params = Record<string, unknown>> = Params & { jsxRenderer?: JSXRenderer }
  export type Control<Klass extends L.Control = any, Params = Record<string, unknown>> = IntrinsicElementChild<any> & { klass: new (...args: any) => Klass, params: { position: L.ControlPosition, mutable?: boolean } & Params }
  export type Layer<Klass extends L.Layer = any, Params = Record<string, unknown>> = { klass: new (...args: any) => Klass, params?: Params } & LayerElementCommon<Klass>
  export type Handler<Klass extends L.Handler = any> = { name: string, klass: new (...args: any) => Klass, enabled: boolean }
  /** Statefull implementation interface for custom layers and controls E.g.
   * ```ts
   * class MyLayer extends L.Layer implements LeafletExtensions.Statefull<MyStateClass>
   * ```
   *  */
  export interface Statefull<S> { getState(): S, setState(state: S): void }
  /**
   * @deprecated Please use the `Statefull` interface instead. This interface had a typo which is why it is deprecated.
   */
  export interface Stateful<S> { getState(): S, setState(state: S): void }
}

export type IntrinsicMapChildren = IntrinsicElementChildren<IntrinsicLayers>

/** Intrinsic leaflet map defintion */
export interface IntrinsicMap extends globalThis.JSX.Element {
  /** A leaflet map */
  lfMap: { options?: Partial<L.MapOptions>, whenReady?: (map: L.Map) => void } & IntrinsicMapChildren & IntrinsicElementChildren<IntrinsicLayerAdditions>
}

/** All leaflet intrinsic elements. You can inherit from this and add your own augmentations, then extends JSX from your inherited interface:
 * @example
 * ```
 * interface CustomizedLeafletIntrinsics extends LeafletIntrinsicElements {
 *   // your custom elements and their props, all tag names must start with "lf" E.g. lfLayer: {name: string}
 * }
 *
 * declare global {
 *   namespace JSX {
 *     interface IntrinsicElements extends CustomizedLeafletIntrinsics { }
 *   }
 * }
 * ```
 */
export interface LeafletIntrinsicElements extends IntrinsicMap, IntrinsicLayers, IntrinsicGroups, IntrinsicLayerAdditions { }

declare global {
  // eslint-disable-next-line no-unused-vars
  namespace JSX {
    // eslint-disable-next-line no-unused-vars
    interface IntrinsicElements extends LeafletIntrinsicElements { }
  }
}

export interface CustomMapOptions extends L.MapOptions {
  maxBounds?: L.LatLngBoundsLiteral
}
