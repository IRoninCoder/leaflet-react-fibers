"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapContext = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const leaflet_1 = __importStar(require("leaflet"));
require("./map.css");
const renderer_1 = __importDefault(require("./renderer"));
const setMapSize = (map, container, style, maxBounds) => {
    if (style && style.width && style.height) {
        // do nothing, it's already applied via spread operator in container JSX
    }
    else if (maxBounds) {
        const bounds = maxBounds;
        const nw = map.latLngToContainerPoint(leaflet_1.default.latLng(bounds[0]));
        const se = map.latLngToContainerPoint(leaflet_1.default.latLng(bounds[1]));
        const size = {
            w: nw.distanceTo(leaflet_1.default.point(se.x, nw.y)),
            h: nw.distanceTo(leaflet_1.default.point(nw.x, se.y))
        };
        container.style.width = size.w + 'px';
        container.style.height = size.h + 'px';
    }
    else {
        // find a sized parent, that is, a parent which is not dimensioned zero in width or height
        let parent = container.parentElement;
        let sizedRect = parent === null || parent === void 0 ? void 0 : parent.getBoundingClientRect();
        while (parent && (!sizedRect || !sizedRect.width || !sizedRect.height)) {
            parent = parent.parentElement;
            sizedRect = parent.getBoundingClientRect();
        }
        if (!sizedRect || !sizedRect.width || !sizedRect.height) {
            throw Error(`react-leaflet-fibers: unable to determine the map size. This is required by leaflet, but not provided. We tried to find a sized parent element, but could not find one.`);
        }
        container.style.width = sizedRect.width + 'px';
        container.style.height = sizedRect.height + 'px';
        // prepare an auto-size listener when parent size changes
        const resizeObserver = new ResizeObserver((e) => {
            if (container) {
                const rect = e[0].contentRect;
                container.style.width = rect.width + 'px';
                container.style.height = rect.height + 'px';
            }
        });
        resizeObserver.observe(parent, { box: 'border-box' });
        map.once('remove', resizeObserver.disconnect);
    }
    map.invalidateSize();
};
exports.MapContext = react_1.default.createContext({ map: null });
const defaultProps = {
    children: [],
    options: {
        crs: leaflet_1.CRS.EPSG3857,
        center: [0, 0],
        zoom: 0
    },
    style: {}
};
const LeafletMap = (_a = { options: {} }) => {
    var { children, options, whenReady, jsxRenderer } = _a, restProps = __rest(_a, ["children", "options", "whenReady", "jsxRenderer"]);
    const containerRef = (0, react_1.useRef)(null);
    const [map, setMap] = (0, react_1.useState)(null);
    const _b = Object.assign(Object.assign(Object.assign({}, defaultProps), { options: Object.assign(Object.assign({}, defaultProps.options), options), style: Object.assign(Object.assign({}, defaultProps.style), restProps.style) }), restProps), { options: mergedOptions } = _b, mergedProps = __rest(_b, ["options"]);
    (0, react_1.useLayoutEffect)(() => {
        if (containerRef.current) {
            const wrapped = ((0, jsx_runtime_1.jsx)("lfMap", Object.assign({ options: mergedOptions, whenReady: (mp) => {
                    setMapSize(mp, containerRef.current, mergedProps.style, mergedOptions.maxBounds);
                    setMap(mp);
                    if (whenReady) {
                        whenReady(mp);
                    }
                } }, { children: (0, jsx_runtime_1.jsx)(exports.MapContext.Provider, Object.assign({ value: { map } }, { children: children }), void 0) }), void 0));
            renderer_1.default.render(wrapped, containerRef.current, jsxRenderer);
        }
    }, [children, options, containerRef.current]);
    return (0, jsx_runtime_1.jsx)("div", Object.assign({ ref: containerRef }, mergedProps), void 0);
};
exports.default = LeafletMap;
