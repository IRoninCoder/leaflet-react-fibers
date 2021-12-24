
import {
  MapOptions, LatLngBoundsExpression, PolylineOptions, TileLayerOptions, WMSOptions,
  Layer, ImageOverlayOptions, MarkerOptions, LatLngExpression, PopupOptions, TooltipOptions,
  VideoOverlayOptions, LayerOptions, CircleMarkerOptions, GeoJSONOptions, GridLayerOptions,
  LayersControlEventHandlerFn, LayerEventHandlerFn, LeafletEventHandlerFn, ResizeEventHandlerFn,
  DragEndEventHandlerFn, ErrorEventHandlerFn, LeafletKeyboardEventHandlerFn,
  LeafletMouseEventHandlerFn, LocationEventHandlerFn, PopupEventHandlerFn, TileErrorEventHandlerFn,
  TileEventHandlerFn, TooltipEventHandlerFn, ZoomAnimEventHandlerFn,
} from 'leaflet'

/** React standard event names as opposed to leaflet's LeafletEventHandlerFnMap */
export interface LeafletReactFiberEvents {
  onBaseLayerChange?: LayersControlEventHandlerFn | undefined;
  onOverlayAdd?: LayersControlEventHandlerFn | undefined;
  onOverlayRemove?: LayersControlEventHandlerFn | undefined;

  onLayerAdd?: LayerEventHandlerFn | undefined;
  onLayerRemove?: LayerEventHandlerFn | undefined;

  onZoomLevelsChange?: LeafletEventHandlerFn | undefined;
  onUnload?: LeafletEventHandlerFn | undefined;
  onViewReset?: LeafletEventHandlerFn | undefined;
  onLoad?: LeafletEventHandlerFn | undefined;
  onZoomStart?: LeafletEventHandlerFn | undefined;
  onMoveStart?: LeafletEventHandlerFn | undefined;
  onZoom?: LeafletEventHandlerFn | undefined;
  onMove?: LeafletEventHandlerFn | undefined;
  onZoomEnd?: LeafletEventHandlerFn | undefined;
  onMoveEnd?: LeafletEventHandlerFn | undefined;
  onAutopanStart?: LeafletEventHandlerFn | undefined;
  onDragStart?: LeafletEventHandlerFn | undefined;
  onDrag?: LeafletEventHandlerFn | undefined;
  onAdd?: LeafletEventHandlerFn | undefined;
  onRemove?: LeafletEventHandlerFn | undefined;
  onLoading?: LeafletEventHandlerFn | undefined;
  onError?: LeafletEventHandlerFn | undefined;
  onUpdate?: LeafletEventHandlerFn | undefined;
  onDown?: LeafletEventHandlerFn | undefined;
  onPreDrag?: LeafletEventHandlerFn | undefined;

  onResize?: ResizeEventHandlerFn | undefined;

  onPopupOpen?: PopupEventHandlerFn | undefined;
  onPopupClose?: PopupEventHandlerFn | undefined;

  onTooltipOpen?: TooltipEventHandlerFn | undefined;
  onTooltipClose?: TooltipEventHandlerFn | undefined;

  onLocationError?: ErrorEventHandlerFn | undefined;

  onLocationFound?: LocationEventHandlerFn | undefined;

  onClick?: LeafletMouseEventHandlerFn | undefined;
  onDblClick?: LeafletMouseEventHandlerFn | undefined;
  onMouseDown?: LeafletMouseEventHandlerFn | undefined;
  onMouseUp?: LeafletMouseEventHandlerFn | undefined;
  onMouseOver?: LeafletMouseEventHandlerFn | undefined;
  onMouseOut?: LeafletMouseEventHandlerFn | undefined;
  onMouseMove?: LeafletMouseEventHandlerFn | undefined;
  onContextMenu?: LeafletMouseEventHandlerFn | undefined;
  onPreClick?: LeafletMouseEventHandlerFn | undefined;

  onKeyPress?: LeafletKeyboardEventHandlerFn | undefined;
  onKeyDown?: LeafletKeyboardEventHandlerFn | undefined;
  onKeyUp?: LeafletKeyboardEventHandlerFn | undefined;

  onZoomAnim?: ZoomAnimEventHandlerFn | undefined;

  onDragEnd?: DragEndEventHandlerFn | undefined;

  onTileUnload?: TileEventHandlerFn | undefined;
  onTileLoadStart?: TileEventHandlerFn | undefined;
  onTileLoad?: TileEventHandlerFn | undefined;

  onTileError?: TileErrorEventHandlerFn | undefined;
}


/** A single child with optional properties */
type Child<T> = React.ReactElement<Partial<{ [K in keyof T]: T[K] }>>
/** One or more JSX children elements */
type IntrinsicElementChildren<T> = { children?: Child<T> | Child<T>[] }
/** One JSX children elements */
type IntrinsicElementChild<T> = { children?: Child<T> }
/** Common types for all layer JSX elements */
type LayerElementCommon<T> = React.RefAttributes<T> & IntrinsicElementChild<IntrinsicLayerAdditions> & LeafletReactFiberEvents & { mutable?: boolean }

interface IntrinsicLayerAdditions extends JSX.Element {
  /** A leaflet popup */
  lfPopup: { options?: PopupOptions, source?: Layer, children: JSX.Element, latlng?: LatLngExpression, isOpen?: boolean } & LeafletReactFiberEvents
  /** A leaflet tooltip */
  lfTooltip: { options?: TooltipOptions, source?: Layer, children: JSX.Element, isOpen?: boolean } & LeafletReactFiberEvents
}

/** Intrinsic layer defintions to extend JSX */
interface IntrinsicLayers extends JSX.Element {
  /** A leaflet image layer */
  lfImage: { imageUrl: string, bounds: LatLngBoundsExpression, options?: ImageOverlayOptions } & LayerElementCommon<L.ImageOverlay>
  /** A leaflet rectangle layer */
  lfRectangle: { bounds: LatLngBoundsExpression, options?: PolylineOptions } & LayerElementCommon<L.Rectangle>
  /** A leaflet marker */
  lfMarker: { latlng: LatLngExpression, options?: MarkerOptions } & LayerElementCommon<L.Marker>
  /** A leaflet tile layer */
  lfTiles: { urlTemplate: string, options?: TileLayerOptions } & LayerElementCommon<L.TileLayer>
  /** A leaflet WMS layer */
  lfTilesWMS: { baseUrl: string, options: WMSOptions } & LayerElementCommon<L.TileLayer.WMS>
  /** A leaflet video layer */
  lfVideo: { video: string | string[] | HTMLVideoElement, bounds: LatLngBoundsExpression, options?: VideoOverlayOptions } & LayerElementCommon<L.VideoOverlay>
  /** A leaflet polyline layer */
  lfPolyline: { latlngs: LatLngExpression[] | LatLngExpression[][] | LatLngExpression[][][], options?: PolylineOptions } & LayerElementCommon<L.Polyline>
  /** A leaflet polygon layer */
  lfPolygon: { latlngs: LatLngExpression[] | LatLngExpression[][] | LatLngExpression[][][], options?: PolylineOptions } & LayerElementCommon<L.Polygon>
  /** A leaflet circle layer */
  lfCircle: { latlng: LatLngExpression, options?: CircleMarkerOptions } & LayerElementCommon<L.Circle>
  /** A leaflet circle marker layer */
  lfCircleMarker: { latlng: LatLngExpression, options?: CircleMarkerOptions } & LayerElementCommon<L.CircleMarker>
  /** A leaflet svg layer */
  lfSVG: { svgImage: string | SVGElement, bounds: LatLngBoundsExpression, options?: ImageOverlayOptions } & LayerElementCommon<L.SVGOverlay>
  /** A leaflet geojson layer */
  lfGeoJSON: { geojson?: GeoJSON.GeoJsonObject & { [key: string]: any }, options?: GeoJSONOptions<any> } & LayerElementCommon<L.GeoJSON>
  /** A leaflet grid layer */
  lfGridLayer: { options?: GridLayerOptions } & LeafletReactFiberEvents
}

interface IntrinsicGroups extends JSX.Element {
  /** A leaflet layergroup */
  lfLayerGroup: { layers?: Layer[], options?: LayerOptions, mutable?: boolean } & LeafletReactFiberEvents & IntrinsicElementChildren<IntrinsicLayerAdditions> & IntrinsicElementChildren<IntrinsicLayers>
  /** A leaflet featuregroup layer */
  lfFeatureGroup: { layers?: Layer[], options?: LayerOptions, mutable?: boolean } & LeafletReactFiberEvents & IntrinsicElementChildren<IntrinsicLayerAdditions> & IntrinsicElementChildren<IntrinsicLayers>
}

/** A render function capable of rendering standard JSX E.g. ReactDom.render */
export type JSXRenderer = (element: JSX.Element, container: HTMLElement) => Element

/** Leaflet customization types. Use them to help with augmenting the JSX namespace */
export namespace LeafletExtensions {
  /** Updatable class constructore wrapper type E.g. 
   * ```ts
   * constructor(params: Updatable<MyClassParams>) { }
   * ```
   * */
  export type Updatable<Params = {}> = Params & { jsxRenderer?: JSXRenderer }
  export type Control<Klass extends L.Control = any, Params = {}> = { klass: new (...args: any) => Klass, params: { position: L.ControlPosition, mutable?: boolean } & Params & IntrinsicElementChild<any> }
  export type Layer<Klass extends L.Layer = any, Params = {}> = { klass: new (...args: any) => Klass, params?: Params } & LayerElementCommon<Klass>
  export type Handler<Klass extends L.Handler = any> = { name: string, klass: new (...args: any) => Klass, enabled: boolean }
  /** Stateful implementation interface for custom layers and controls E.g. 
   * ```ts
   * class MyLayer extends L.Layer implements LeafletExtensions.Stateful<MyStateClass>
   * ```
   *  */
  export interface Stateful<S> { getState(): S, setState(state: S): void }
}

export type IntrinsicMapChildren = IntrinsicElementChildren<IntrinsicLayers>

/** Intrinsic leaflet map defintion */
export interface IntrinsicMap extends JSX.Element {
  /** A leaflet map */
  lfMap: { options?: Partial<MapOptions>, whenReady?: (map: L.Map) => void } & IntrinsicMapChildren & IntrinsicElementChildren<IntrinsicLayerAdditions>
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
  namespace JSX {
    interface IntrinsicElements extends LeafletIntrinsicElements { }
  }
}

export interface CustomMapOptions extends L.MapOptions {
  maxBounds?: L.LatLngBoundsLiteral
}