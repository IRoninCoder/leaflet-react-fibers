import React from "react";
import L from 'leaflet';
import './map.css';
import { CustomMapOptions, IntrinsicMapChildren, JSXRenderer } from "./types";
export declare const MapContext: React.Context<{
    map: L.Map | null;
}>;
export interface ILeafletMapProps extends React.AllHTMLAttributes<HTMLDivElement> {
    children?: IntrinsicMapChildren['children'];
    /** Leaflet map options */
    options?: CustomMapOptions;
    /** Leaflet map events */
    whenReady?: (map: L.Map) => void;
    /** A renderer to use for inner HTML E.g. lfPopup content */
    jsxRenderer?: JSXRenderer;
}
declare const LeafletMap: ({ children, options, whenReady, jsxRenderer, ...restProps }?: ILeafletMapProps) => JSX.Element;
export default LeafletMap;
