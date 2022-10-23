import L from 'leaflet'

export class WindowResizeHandler extends L.Handler {
  addHooks () {
    L.DomEvent.on(window as any, 'resize', this._windowResize, this)
  }

  removeHooks () {
    L.DomEvent.off(window as any, 'resize', this._windowResize, this)
  }

  _windowResize (ev) {
    console.log('You just reized the window')
  }
}
