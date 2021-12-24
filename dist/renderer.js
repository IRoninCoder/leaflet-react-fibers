"use strict";
/// <reference types="../@types" />
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var react_reconciler_1 = __importDefault(require("react-reconciler"));
var leaflet_1 = __importDefault(require("leaflet"));
var lodash_1 = require("lodash");
var marker_icon_png_1 = __importDefault(require("leaflet/dist/images/marker-icon.png"));
var marker_shadow_png_1 = __importDefault(require("leaflet/dist/images/marker-shadow.png"));
var instances = new Map();
var maps = new Map();
var contentRenderer;
/**
 * This method should return a newly created node. For example, the DOM renderer would call `document.createElement(type)` here and then set the properties from `props`.
 *
 * You can use `rootContainer` to access the root container associated with that tree. For example, in the DOM renderer, this is useful to get the correct `document` reference that the root belongs to.
 *
 * The `hostContext` parameter lets you keep track of some information about your current place in the tree. To learn more about it, see `getChildHostContext` below.
 *
 * The `internalHandle` data structure is meant to be opaque. If you bend the rules and rely on its internal fields, be aware that it may change significantly between versions. You're taking on additional maintenance risk by reading from it, and giving up all guarantees if you write something to it.
 *
 * This method happens **in the render phase**. It can (and usually should) mutate the node it has just created before returning it, but it must not modify any other nodes. It must not register any event handlers on the parent tree. This is because an instance being created doesn't guarantee it would be placed in the tree — it could be left unused and later collected by GC. If you need to do something when an instance is definitely in the tree, look at `commitMount` instead.
 */
var createInstance = function (type, props, rootContainer, hostContext, internalHandle) {
    var instance;
    switch (type) {
        case 'lfMap': {
            var _a = props, options = _a.options, whenReady_1 = _a.whenReady, restProps = __rest(_a, ["options", "whenReady"]);
            var mp_1 = leaflet_1.default.map(rootContainer, options);
            if (whenReady_1) {
                mp_1.whenReady(function () { return whenReady_1(mp_1); });
            }
            maps.set(rootContainer, mp_1);
            instance = {
                type: type,
                category: 'map',
                leaflet: mp_1,
                props: props
            };
            break;
        }
        case 'lfImage': {
            var lfImageProps = props;
            var layer = leaflet_1.default.imageOverlay(lfImageProps.imageUrl, lfImageProps.bounds, lfImageProps.options);
            setProps(layer, lfImageProps);
            instance = {
                type: type,
                category: 'layer',
                leaflet: layer,
                props: props
            };
            break;
        }
        case 'lfPopup': {
            var _b = props, children = _b.children, latlng = _b.latlng, restProps = __rest(_b, ["children", "latlng"]);
            var layer = leaflet_1.default.popup(restProps.options);
            var element = document.createElement('section'); //TODO: imrove the wrapper element for lfPopup
            layer.setContent(element);
            setProps(layer, restProps);
            if (contentRenderer) {
                contentRenderer(children, element);
            }
            instance = {
                type: type,
                category: 'layer',
                leaflet: layer,
                props: props
            };
            break;
        }
        case 'lfTooltip': {
            var _c = props, children = _c.children, restProps = __rest(_c, ["children"]);
            var layer = leaflet_1.default.tooltip(restProps.options);
            var element = document.createElement('section'); //TODO: imrove the wrapper element for lfPopup
            layer.setContent(element);
            setProps(layer, restProps);
            if (contentRenderer) {
                contentRenderer(children, element);
            }
            instance = {
                type: type,
                category: 'layer',
                leaflet: layer,
                props: props
            };
            break;
        }
        case 'lfRectangle': {
            var _d = props, bounds = _d.bounds, options = _d.options, restProps = __rest(_d, ["bounds", "options"]);
            var layer = leaflet_1.default.rectangle(bounds, options);
            setProps(layer, restProps);
            instance = {
                type: type,
                category: 'layer',
                leaflet: layer,
                props: props
            };
            break;
        }
        case 'lfMarker': {
            var _e = props, latlng = _e.latlng, restProps = __rest(_e, ["latlng"]);
            var icon = leaflet_1.default.icon({
                iconUrl: marker_icon_png_1.default,
                shadowUrl: marker_shadow_png_1.default
            });
            var layer = leaflet_1.default.marker(latlng, __assign({ icon: icon }, restProps.options));
            setProps(layer, restProps);
            instance = {
                type: type,
                category: 'layer',
                leaflet: layer,
                props: props
            };
            break;
        }
        case 'lfTiles': {
            var _f = props, urlTemplate = _f.urlTemplate, restProps = __rest(_f, ["urlTemplate"]);
            var layer = leaflet_1.default.tileLayer(urlTemplate, restProps.options);
            setProps(layer, restProps);
            instance = {
                type: type,
                category: 'layer',
                leaflet: layer,
                props: props
            };
            break;
        }
        case 'lfTilesWMS': {
            var _g = props, baseUrl = _g.baseUrl, restProps = __rest(_g, ["baseUrl"]);
            var layer = leaflet_1.default.tileLayer.wms(baseUrl, restProps.options);
            setProps(layer, restProps);
            instance = {
                type: type,
                category: 'layer',
                leaflet: layer,
                props: props
            };
            break;
        }
        case 'lfVideo': {
            var _h = props, video = _h.video, bounds = _h.bounds, restProps = __rest(_h, ["video", "bounds"]);
            var layer = leaflet_1.default.videoOverlay(video, bounds, restProps.options);
            setProps(layer, restProps);
            instance = {
                type: type,
                category: 'layer',
                leaflet: layer,
                props: props
            };
            break;
        }
        case 'lfPolyline': {
            var _j = props, latlngs = _j.latlngs, restProps = __rest(_j, ["latlngs"]);
            var layer = leaflet_1.default.polyline(latlngs, restProps.options);
            setProps(layer, restProps);
            instance = {
                type: type,
                category: 'layer',
                leaflet: layer,
                props: props
            };
            break;
        }
        case 'lfPolygon': {
            var _k = props, latlngs = _k.latlngs, restProps = __rest(_k, ["latlngs"]);
            var layer = leaflet_1.default.polygon(latlngs, restProps.options);
            setProps(layer, restProps);
            instance = {
                type: type,
                category: 'layer',
                leaflet: layer,
                props: props
            };
            break;
        }
        case 'lfCircle': {
            var _l = props, latlng = _l.latlng, restProps = __rest(_l, ["latlng"]);
            var layer = leaflet_1.default.circle(latlng, restProps.options);
            setProps(layer, restProps);
            instance = {
                type: type,
                category: 'layer',
                leaflet: layer,
                props: props
            };
            break;
        }
        case 'lfCircleMarker': {
            var _m = props, latlng = _m.latlng, restProps = __rest(_m, ["latlng"]);
            var layer = leaflet_1.default.circleMarker(latlng, restProps.options);
            setProps(layer, restProps);
            instance = {
                type: type,
                category: 'layer',
                leaflet: layer,
                props: props
            };
            break;
        }
        case 'lfSVG': {
            var _o = props, svgImage = _o.svgImage, bounds = _o.bounds, restProps = __rest(_o, ["svgImage", "bounds"]);
            var layer = leaflet_1.default.svgOverlay(svgImage, bounds, restProps.options);
            setProps(layer, restProps);
            instance = {
                type: type,
                category: 'layer',
                leaflet: layer,
                props: props
            };
            break;
        }
        case 'lfLayerGroup': {
            var _p = props, children = _p.children, restProps = __rest(_p, ["children"]);
            var layer = leaflet_1.default.layerGroup([], restProps.options);
            setProps(layer, restProps);
            instance = {
                type: type,
                category: 'layergroup',
                leaflet: layer,
                props: props
            };
            break;
        }
        case 'lfFeatureGroup': {
            var _q = props, children = _q.children, restProps = __rest(_q, ["children"]);
            var layer = leaflet_1.default.featureGroup([], restProps.options);
            setProps(layer, restProps);
            instance = {
                type: type,
                category: 'featuregroup',
                leaflet: layer,
                props: props
            };
            break;
        }
        case 'lfGeoJSON': {
            var _r = props, geojson = _r.geojson, restProps = __rest(_r, ["geojson"]);
            var layer = leaflet_1.default.geoJSON(geojson, restProps.options);
            setProps(layer, restProps);
            instance = {
                type: type,
                category: 'layer',
                leaflet: layer,
                props: props
            };
            break;
        }
        case 'lfGridLayer': {
            var restProps = props;
            var layer = leaflet_1.default.gridLayer(restProps.options);
            setProps(layer, restProps);
            instance = {
                type: type,
                category: 'layer',
                leaflet: layer,
                props: props
            };
            break;
        }
    }
    if (!instance) {
        if (type.indexOf('Layer') > -1) {
            var layerProps = props;
            var klassInstance = new layerProps.klass(__assign(__assign({}, layerProps.params), { children: props.children, jsxRenderer: contentRenderer }));
            setProps(klassInstance, layerProps);
            instance = {
                type: type,
                category: 'layer',
                leaflet: klassInstance,
                props: props
            };
        }
        else if (type.indexOf('Control') > -1) {
            var controlProps = props;
            var klassInstance = new controlProps.klass(__assign(__assign({}, controlProps.params), { children: props.children, jsxRenderer: contentRenderer }));
            instance = {
                type: type,
                category: 'control',
                leaflet: klassInstance,
                props: props
            };
        }
        else if (type.indexOf('Handler') > -1) {
            var handlerProps = props;
            instance = {
                type: type,
                category: 'handler',
                leaflet: handlerProps.klass,
                props: props
            };
        }
        if (type.startsWith('lf') && !instance) {
            throw Error("react-leaflet-fibers: Unknown type ".concat(type, ". If you are trying to use customized JSX, then make sure that your intrinsic declaration (aka tag name) ends with one of \"Control\", \"Layer\" or \"Handler\"."));
        }
    }
    return instance;
};
var hostConfig = {
    supportsMutation: true,
    supportsPersistence: false,
    createInstance: createInstance,
    /**
    * Same as `createInstance`, but for text nodes. If your renderer doesn't support text nodes, you can throw here.
    */
    createTextInstance: function (text, rootContainer, hostContext, internalHandle) {
        // do not throw due to possibility of inner HTML E.g. lfPopup content
        return null;
    },
    /**
     * This method should mutate the `parentInstance` and add the child to its list of children. For example, in the DOM this would translate to a `parentInstance.appendChild(child)` call.
     *
     * This method happens **in the render phase**. It can mutate `parentInstance` and `child`, but it must not modify any other nodes. It's called while the tree is still being built up and not connected to the actual tree on the screen.
    */
    appendInitialChild: function (parentInstance, childInstance) {
        if (!parentInstance || !childInstance)
            return;
        childInstance.parent = parentInstance;
        if (parentInstance.category === 'map' && childInstance.category === 'handler') {
            var parent_1 = parentInstance.leaflet;
            var handler = childInstance.leaflet;
            var props = childInstance.props;
            parent_1.addHandler(props.name, handler);
            if (props.enabled) {
                parent_1[props.name].enable();
            }
            else {
                parent_1[props.name].disable();
            }
            return;
        }
        switch (parentInstance.category) {
            case 'layergroup':
            case 'featuregroup':
            case 'map': {
                switch (childInstance.category) {
                    default:
                        // special treatment needed for popups, tooltips
                        if (childInstance.type !== 'lfPopup' && childInstance.type !== 'lfTooltip') {
                            var child = childInstance.leaflet;
                            var parent_2 = parentInstance.leaflet;
                            child.addTo(parent_2);
                        }
                        break;
                }
            }
        }
    },
    /**
     * In this method, you can perform some final mutations on the `instance`. Unlike with `createInstance`, by the time `finalizeInitialChildren` is called, all the initial children have already been added to the `instance`, but the instance itself has not yet been connected to the tree on the screen.
     *
     * This method happens **in the render phase**. It can mutate `instance`, but it must not modify any other nodes. It's called while the tree is still being built up and not connected to the actual tree on the screen.
     *
     * There is a second purpose to this method. It lets you specify whether there is some work that needs to happen when the node is connected to the tree on the screen. If you return `true`, the instance will receive a `commitMount` call later. See its documentation below.
     *
     * If you don't want to do anything here, you should return `false`.
     */
    finalizeInitialChildren: function (instance, type, props, rootContainer, hostContext) {
        return true;
    },
    /**
     * React calls this method so that you can compare the previous and the next props, and decide whether you need to update the underlying instance or not. If you don't need to update it, return `null`. If you need to update it, you can return an arbitrary object representing the changes that need to happen. Then in `commitUpdate` you would need to apply those changes to the instance.
     *
     * This method happens **in the render phase**. It should only *calculate* the update — but not apply it! For example, the DOM renderer returns an array that looks like `[prop1, value1, prop2, value2, ...]` for all props that have actually changed. And only in `commitUpdate` it applies those changes. You should calculate as much as you can in `prepareUpdate` so that `commitUpdate` can be very fast and straightforward.
     *
     * See the meaning of `rootContainer` and `hostContext` in the `createInstance` documentation.
     */
    prepareUpdate: function (instance, type, _a, _b, rootContainer, hostContext) {
        var oldChilds = _a.children, oldProps = __rest(_a, ["children"]);
        var newChilds = _b.children, newProps = __rest(_b, ["children"]);
        if (propsChanged(oldProps, newProps)) {
            return {
                rootContainer: rootContainer,
                hostContext: hostContext
            };
        }
        return null;
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
    shouldSetTextContent: function (type, props) {
        return false;
    },
    /**
    * This method lets you return the initial host context from the root of the tree. See `getChildHostContext` for the explanation of host context.
    *
    * If you don't intend to use host context, you can return `null`.
    *
    * This method happens **in the render phase**. Do not mutate the tree from it.
    */
    getRootHostContext: function (rootContainer) {
        return {};
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
    getChildHostContext: function (parentHostContext, type, rootContainer) {
        return parentHostContext;
    },
    /**
    * Determines what object gets exposed as a ref. You'll likely want to return the `instance` itself. But in some cases it might make sense to only expose some part of it.
    *
    * If you don't want to do anything here, return `instance`.
    */
    getPublicInstance: function (instance) {
        return instance === null || instance === void 0 ? void 0 : instance.leaflet;
    },
    /**
    * This method lets you store some information before React starts making changes to the tree on the screen. For example, the DOM renderer stores the current text selection so that it can later restore it. This method is mirrored by `resetAfterCommit`.
    *
    * Even if you don't want to do anything here, you need to return `null` from it.
    */
    prepareForCommit: function (containerInfo) {
        return null;
    },
    /**
    * This method is called right after React has performed the tree mutations. You can use it to restore something you've stored in `prepareForCommit` — for example, text selection.
    *
    * You can leave it empty.
    */
    resetAfterCommit: function (containerInfo) {
    },
    /**
     * This method is called for a container that's used as a portal target. Usually you can leave it empty.
     */
    preparePortalMount: function (containerInfo) {
    },
    /**
     * You can proxy this to `performance.now()` or its equivalent in your environment.
     */
    now: function () { return performance.now(); },
    /**
     * You can proxy this to `setTimeout` or its equivalent in your environment.
     */
    scheduleTimeout: function (fn, delay) {
        setTimeout(fn, delay);
    },
    /**
     * You can proxy this to `clearTimeout` or its equivalent in your environment.
     */
    cancelTimeout: function (id) {
        clearTimeout(id);
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
    appendChild: function (parentInstance, child) {
        if (!parentInstance || !child)
            return;
        child.parent = parentInstance;
        switch (parentInstance === null || parentInstance === void 0 ? void 0 : parentInstance.category) {
            case 'map':
            case 'layergroup':
            case 'featuregroup':
                var parent_3 = parentInstance.leaflet;
                var layer = child === null || child === void 0 ? void 0 : child.leaflet;
                parent_3.addLayer(layer);
                break;
        }
    },
    /**
    * Same as `appendChild`, but for when a node is attached to the root container. This is useful if attaching to the root has a slightly different implementation, or if the root container nodes are of a different type than the rest of the tree.
    */
    appendChildToContainer: function (container, child) {
        // leaflet already does the attaching
        return null;
    },
    /**
    * This method should mutate the `parentInstance` and place the `child` before `beforeChild` in the list of its children. For example, in the DOM this would translate to a `parentInstance.insertBefore(child, beforeChild)` call.
    *
    * Note that React uses this method both for insertions and for reordering nodes. Similar to DOM, it is expected that you can call `insertBefore` to reposition an existing child. Do not mutate any other parts of the tree from it.
    */
    insertBefore: function (parentInstance, child, beforeChild) {
        var _a, _b;
        switch (parentInstance === null || parentInstance === void 0 ? void 0 : parentInstance.category) {
            case 'map':
            case 'layergroup':
            case 'featuregroup':
                var parent_4 = parentInstance.leaflet;
                var layer = child === null || child === void 0 ? void 0 : child.leaflet;
                parent_4.addLayer(layer);
                // New layers are added on top so let's see if we can fix that, when they share the parent element. 
                // Sometimes they do not since leaflet layer insertions do not match JSX defs. 
                // E.g. all lfCircle are added to a common <svg> element so if we place one next to a lfTileLayer, 
                // then they will be added to different DOM elements and insertBefore is meaningless
                var childAny = child === null || child === void 0 ? void 0 : child.leaflet;
                var beforeChildAny = beforeChild === null || beforeChild === void 0 ? void 0 : beforeChild.leaflet;
                var element = childAny.getElement ? childAny.getElement() : childAny.getContainer ? childAny.getContainer : null, elementBefore = beforeChildAny.getElement ? beforeChildAny.getElement() : beforeChildAny.getContainer ? beforeChildAny.getContainer : null;
                if (element && elementBefore && element.parentNode === elementBefore.parentNode) {
                    (_a = element.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(element);
                    (_b = elementBefore.parentNode) === null || _b === void 0 ? void 0 : _b.insertBefore(element, elementBefore);
                }
                break;
        }
    },
    /**
    * Same as `insertBefore`, but for when a node is attached to the root container. This is useful if attaching to the root has a slightly different implementation, or if the root container nodes are of a different type than the rest of the tree.
    */
    // insertInContainerBefore: (container, child, beforeChild) => { },
    /**
    * This method should mutate the `parentInstance` to remove the `child` from the list of its children.
    *
    * React will only call it for the top-level node that is being removed. It is expected that garbage collection would take care of the whole subtree. You are not expected to traverse the child tree in it.
    */
    removeChild: function (parentInstance, child) {
        switch (parentInstance === null || parentInstance === void 0 ? void 0 : parentInstance.category) {
            case 'map':
            case 'layergroup':
            case 'featuregroup':
                var parent_5 = parentInstance.leaflet;
                var layer = child === null || child === void 0 ? void 0 : child.leaflet;
                parent_5.removeLayer(layer);
                break;
        }
    },
    /**
    * Same as `removeChild`, but for when a node is detached from the root container. This is useful if attaching to the root has a slightly different implementation, or if the root container nodes are of a different type than the rest of the tree.
    */
    removeChildFromContainer: function (container, child) {
        var map = child.leaflet;
        map === null || map === void 0 ? void 0 : map.remove();
    },
    /**
    * If you returned `true` from `shouldSetTextContent` for the previous props, but returned `false` from `shouldSetTextContent` for the next props, React will call this method so that you can clear the text content you were managing manually. For example, in the DOM you could set `node.textContent = ''`.
    *
    * If you never return `true` from `shouldSetTextContent`, you can leave it empty.
    */
    // resetTextContent: (instance) => { },
    /**
     * This method should mutate the `textInstance` and update its text content to `nextText`.
     *
     * Here, `textInstance` is a node created by `createTextInstance`.
     */
    // commitTextUpdate: (textInstance, oldText, newText) => { },
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
    commitMount: function (instance, type, props, internalInstanceHandle) {
        var _a, _b, _c;
        switch ((_a = instance === null || instance === void 0 ? void 0 : instance.parent) === null || _a === void 0 ? void 0 : _a.category) {
            case 'map': {
                // popup as a layer
                if (instance.type === 'lfPopup') {
                    var popup_1 = instance === null || instance === void 0 ? void 0 : instance.leaflet;
                    var popupProps_1 = instance === null || instance === void 0 ? void 0 : instance.props;
                    var parent_6 = instance.parent.leaflet;
                    if (popupProps_1.latlng) {
                        popup_1.setLatLng(popupProps_1.latlng);
                        if (popupProps_1.isOpen) {
                            popup_1.openPopup();
                        }
                    }
                    //TODO: what about click event handlers on the map or popup itself? this seeems to be a single handler for a singler event
                    parent_6.on('click', function (e) {
                        if (!popupProps_1.latlng) {
                            popup_1.setLatLng(e.latlng);
                        }
                        popup_1.openOn(parent_6);
                    });
                }
                break;
            }
            case 'layer':
            case 'layergroup':
            case 'featuregroup': {
                // popup as an attachment
                if (instance.type === 'lfPopup') {
                    var popup = instance === null || instance === void 0 ? void 0 : instance.leaflet;
                    var popupProps = instance === null || instance === void 0 ? void 0 : instance.props;
                    var parent_7 = (_b = instance === null || instance === void 0 ? void 0 : instance.parent) === null || _b === void 0 ? void 0 : _b.leaflet;
                    parent_7.bindPopup(popup, popupProps.options);
                    if (popupProps.isOpen) {
                        popup.openPopup();
                    }
                }
                // tooltip as an attachment
                if (instance.type === 'lfTooltip') {
                    var tooltip = instance === null || instance === void 0 ? void 0 : instance.leaflet;
                    var tooltipProps = instance === null || instance === void 0 ? void 0 : instance.props;
                    var parent_8 = (_c = instance === null || instance === void 0 ? void 0 : instance.parent) === null || _c === void 0 ? void 0 : _c.leaflet;
                    parent_8.bindTooltip(tooltip, tooltipProps.options);
                    if (tooltipProps.isOpen) {
                        tooltip.openTooltip();
                    }
                }
                break;
            }
        }
    },
    /**
    * This method should mutate the `instance` according to the set of changes in `updatePayload`. Here, `updatePayload` is the object that you've returned from `prepareUpdate` and has an arbitrary structure that makes sense for your renderer. For example, the DOM renderer returns an update payload like `[prop1, value1, prop2, value2, ...]` from `prepareUpdate`, and that structure gets passed into `commitUpdate`. Ideally, all the diffing and calculation should happen inside `prepareUpdate` so that `commitUpdate` can be fast and straightforward.
    *
    * The `internalHandle` data structure is meant to be opaque. If you bend the rules and rely on its internal fields, be aware that it may change significantly between versions. You're taking on additional maintenance risk by reading from it, and giving up all guarantees if you write something to it.
    */
    commitUpdate: function (instance, updatePayload, type, prevProps, nextProps, internalHandle) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        var map = maps.get(updatePayload.rootContainer);
        switch (instance === null || instance === void 0 ? void 0 : instance.category) {
            case 'map': {
                map.options = __assign(__assign({}, prevProps.options), nextProps.options);
                map.invalidateSize({ animate: false });
                break;
            }
            case 'handler': {
                var parent_9 = map;
                var props = nextProps;
                if (props.enabled) {
                    parent_9[props.name].enable();
                }
                else {
                    parent_9[props.name].disable();
                }
                break;
            }
            case 'layer':
            case 'layergroup':
            case 'featuregroup': {
                var layer = instance === null || instance === void 0 ? void 0 : instance.leaflet;
                // special case of attached popup
                if (instance.type === 'lfPopup') {
                    var popup = instance.leaflet;
                    var popupProps = nextProps;
                    if (popupProps.latlng) {
                        popup.setLatLng(popupProps.latlng);
                    }
                    if (((_a = instance.parent) === null || _a === void 0 ? void 0 : _a.category) === 'map') {
                        var parent_10 = (_b = instance.parent) === null || _b === void 0 ? void 0 : _b.leaflet;
                        if (popupProps.isOpen) {
                            parent_10.openPopup(popup);
                        }
                        else {
                            parent_10.closePopup(popup);
                        }
                    }
                    else {
                        var parent_11 = (_c = instance.parent) === null || _c === void 0 ? void 0 : _c.leaflet;
                        if (popupProps.isOpen) {
                            parent_11.openPopup();
                        }
                        else {
                            parent_11.closePopup();
                        }
                    }
                }
                else {
                    if (((_d = instance.parent) === null || _d === void 0 ? void 0 : _d.category) === 'map' || ((_e = instance.parent) === null || _e === void 0 ? void 0 : _e.category) === 'featuregroup' || ((_f = instance.parent) === null || _f === void 0 ? void 0 : _f.category) === 'layergroup') {
                        var parent_12 = (_g = instance.parent) === null || _g === void 0 ? void 0 : _g.leaflet;
                        var newInstance = createInstance(type, nextProps, updatePayload.rootContainer, updatePayload.hostContext, internalHandle);
                        var newLayer = newInstance === null || newInstance === void 0 ? void 0 : newInstance.leaflet;
                        var layerProps = nextProps;
                        // stateful layer, default behavior
                        if (!layerProps.hasOwnProperty('mutable') || layerProps.mutable) {
                            if (layer.getState && newLayer.setState) {
                                var oldState = layer.getState();
                                newLayer.setState(oldState);
                            }
                            parent_12.removeLayer(layer);
                            parent_12.addLayer(newLayer);
                        }
                        // standard layer
                        else {
                            // not much can change after layer is created, note that popups and tooltips are handled via JSX directly
                        }
                        instance.leaflet = newInstance.leaflet;
                    }
                }
                break;
            }
            case 'control': {
                var parent_13 = (_h = instance.parent) === null || _h === void 0 ? void 0 : _h.leaflet;
                var control = instance === null || instance === void 0 ? void 0 : instance.leaflet;
                var controlProps = nextProps;
                var newInstance = createInstance(type, nextProps, updatePayload.rootContainer, updatePayload.hostContext, internalHandle);
                var newControl = newInstance === null || newInstance === void 0 ? void 0 : newInstance.leaflet;
                // stateful control, default behavior
                if (!controlProps.hasOwnProperty('mutable') || controlProps.mutable) {
                    if (control.getState && newControl.setState) {
                        var oldState = control.getState();
                        newControl.setState(oldState);
                    }
                    parent_13.removeControl(control);
                    parent_13.addControl(newControl);
                }
                // standard control
                else {
                    control.setPosition(controlProps.position);
                }
                instance.leaflet = newInstance.leaflet;
                break;
            }
        }
    },
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
    clearContainer: function (container) {
    },
    // -------------------
    // Hydration Methods
    //    (optional)
    // You can optionally implement hydration to "attach" to the existing tree during the initial render instead of creating it from scratch. For example, the DOM renderer uses this to attach to an HTML markup.
    //
    // To support hydration, you need to declare `supportsHydration: true` and then implement the methods in the "Hydration" section [listed in this file](https://github.com/facebook/react/blob/master/packages/react-reconciler/src/forks/ReactFiberHostConfig.custom.js). File an issue if you need help.
    // -------------------
    supportsHydration: false,
    // canHydrateInstance: (instance, type, props) => { },
    // canHydrateTextInstance: (instance, text) => { },
    // canHydrateSuspenseInstance: (instance) => { },
    // isSuspenseInstancePending: (instance) => { },
    // isSuspenseInstanceFallback: (instance) => { },
    // registerSuspenseInstanceRetry: (instance, callback) => { },
    // getNextHydratableSibling: (instance) => { },
    // getFirstHydratableChild: (parentInstance) => { },
    // hydrateInstance: (instance, type, props, rootContainerInstance, hostContext, internalInstanceHandle) => { },
    // hydrateTextInstance: (textInstance, text, internalInstanceHandle) => { },
    // hydrateSuspenseInstance: (suspenseInstance, internalInstanceHandle) => { },
    // getNextHydratableInstanceAfterSuspenseInstance: (suspenseInstance) => { },
    // // Returns the SuspenseInstance if this node is a direct child of a
    // // SuspenseInstance. I.e. if its previous sibling is a Comment with
    // // SUSPENSE_x_START_DATA. Otherwise, null.
    // getParentSuspenseInstance: (targetInstance) => { },
    // commitHydratedContainer: (container) => { },
    // commitHydratedSuspenseInstance: (suspenseInstance) => { },
    // didNotMatchHydratedContainerTextInstance: (parentContainer, textInstance, text) => { },
    // didNotMatchHydratedTextInstance: (parentType, parentProps, parentInstance, textInstance, text) => { },
    // didNotHydrateContainerInstance: (parentContainer, instance) => { },
    // didNotHydrateInstance: (parentType, parentProps, parentInstance, instance) => { },
    // didNotFindHydratableContainerInstance: (parentContainer, type, props) => { },
    // didNotFindHydratableContainerTextInstance: (parentContainer, text) => { },
    // didNotFindHydratableContainerSuspenseInstance: (parentContainer) => { },
    // didNotFindHydratableInstance: (parentType, parentProps, parentInstance, type, props) => { },
    // didNotFindHydratableTextInstance: (parentType, parentProps, parentInstance, text) => { },
    // didNotFindHydratableSuspenseInstance: (parentType, parentProps, parentInstance) => { },
};
var setProps = function (leaflet, props) {
    var keys = Object.keys(props);
    keys.forEach(function (key) {
        if ((0, lodash_1.isFunction)(props[key]) && leaflet.on) {
            var leafletKey = key.startsWith('on') ? key.substr(2).toLocaleLowerCase('en-US') : key;
            leaflet.on(leafletKey, props[key]);
        }
        var setter = 'set' + key[0].toLocaleUpperCase('en-US') + (key.length > 1 ? key.substr(1) : '');
        if (leaflet[setter] && (0, lodash_1.isFunction)(leaflet[setter])) {
            leaflet[setter](props[key]);
        }
    });
};
var propsChanged = function (oldProps, nextProps) {
    var isEqual = (0, lodash_1.isEqualWith)(oldProps, nextProps, function (a, b) {
        // non-memoized functions should not result in layer re-renders, compare function bodies instead
        if ((0, lodash_1.isFunction)(a) || (0, lodash_1.isFunction)(b)) {
            return a.toString() === b.toString();
        }
    });
    return !isEqual;
};
var renderer = (0, react_reconciler_1.default)(hostConfig);
exports.default = {
    render: function (reactElement, domElement, jsxRenderer, callback) {
        contentRenderer = jsxRenderer;
        var container;
        if (instances.has(domElement)) {
            container = instances.get(domElement);
        }
        else {
            container = renderer.createContainer(domElement, 1, false, { onDeleted: callback, onHydrated: callback });
            instances.set(domElement, container);
        }
        renderer.updateContainer(reactElement, container, null, callback);
    }
};
