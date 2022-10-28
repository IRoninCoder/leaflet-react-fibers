import React, { useMemo } from 'react'
import ReactDOM from 'react-dom'

import { CustomMapOptions } from '../../lib/catalog'
import LeafletMap from '../../lib/map'

const mapOpts: CustomMapOptions = {
  minZoom: 10,
  maxZoom: 20,
  zoom: 1,
  maxBoundsViscosity: 1,
  center: [34.052235, -118.243683]
}

const SvgLayers = ({ zPosition }: { zPosition: 'top' | 'bottom' }) => {
  // Leaflet adds additional attributes to this node after it is rendered.
  // This will cause fiber's prop comparison to detect a change.
  // Using memo prvents this. Alternatively we can define this outside of this component's scope.
  const svgElement = useMemo(() => {
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    svgElement.setAttribute('viewBox', '0 0 100 100')
    svgElement.innerHTML = '<rect width="100" height="100"/><rect x="37.5" y="12.5" width="25" height="25" style="fill:red"/><rect x="37.5" y="62.5" width="25" height="25" style="fill:#0013ff"/>'

    return svgElement
  }, [])

  return (
    <LeafletMap options={mapOpts} jsxRenderer={ReactDOM.render}>
      <lfSVG svgImage={svgElement} bounds={[[34, -118], [33.9, -118.5]]} data-testid='lfSVG' />

      {zPosition === 'bottom' && (
        <lfCircle latlng={[34, -118.21]} options={{ color: 'yellow', radius: 3000 }} data-testid='lfCircle'>
          <lfPopup options={{ autoClose: true }}>
            <div>
              Circle
            </div>
          </lfPopup>
          <lfTooltip>
            <>lfCircle</>
          </lfTooltip>
        </lfCircle>
      )}

      <lfPolygon options={{ fillOpacity: 0.7 }} data-testid='lfPolygon' latlngs={[
        [
          34.16124999108587,
          -118.46900939941406
        ],
        [
          34.112941557095596,
          -118.48205566406251
        ],
        [
          33.96500329452545,
          -118.37013244628905
        ],
        [
          33.899486813913285,
          -118.37425231933594
        ],
        [
          33.85616131412811,
          -118.28636169433594
        ],
        [
          33.82593446346627,
          -118.24996948242188
        ],
        [
          33.82593446346627,
          -118.20945739746094
        ],
        [
          33.985502440044165,
          -118.16757202148436
        ],
        [
          33.99518087394024,
          -118.17855834960938
        ],
        [
          34.15386343128204,
          -118.1318664550781
        ],
        [
          34.16124999108587,
          -118.46900939941406
        ]
      ]}>
        <lfPopup options={{ autoClose: true }}>
          <div>
            Plolygon
          </div>
        </lfPopup>
        <lfTooltip options={{ direction: 'bottom', offset: [0, 90] }}>
          <>lfPolygon</>
        </lfTooltip>
      </lfPolygon>

      <lfPolyline options={{ fill: true, color: 'red', fillColor: 'red', fillOpacity: 0.7 }} data-testid='lfPolyline' latlngs={[
        [
          34.03274552068691,
          -118.42094421386719
        ],
        [
          34.04071164207858,
          -118.27606201171874
        ],
        [
          33.92911789997692,
          -118.28086853027344
        ],
        [
          33.92455994198492,
          -118.33923339843749
        ],
        [
          33.93481500447212,
          -118.35296630859374
        ],
        [
          33.93196649986436,
          -118.37356567382814
        ],
        [
          34.03274552068691,
          -118.42094421386719
        ]
      ]}>
        <lfPopup options={{ autoClose: true }}>
          <>
            Polyline
          </>
        </lfPopup>
        <lfTooltip>
          <>lfPolyline</>
        </lfTooltip>
      </lfPolyline>

      <lfRectangle options={{ color: 'green' }} data-testid='lfRectangle' bounds={[
        [
          34.0839432446153,
          -118.41133117675781
        ],
        [
          34.0839432446153,
          -118.28086853027344
        ],
        [
          34.14022500809142,
          -118.28086853027344
        ],
        [
          34.14022500809142,
          -118.41133117675781
        ],
        [
          34.0839432446153,
          -118.41133117675781
        ]
      ]}>
        <lfPopup options={{ autoClose: true }}>
          <span>
            Rectangle
          </span>
        </lfPopup>
        <lfTooltip>
          <>lfRectangle</>
        </lfTooltip>
      </lfRectangle>

      {zPosition === 'top' && (
        <lfCircle latlng={[34, -118.21]} data-testid='lfCircle' options={{ color: 'cyan', radius: 3000 }}>
          <lfPopup options={{ autoClose: true }}>
            <div>
              Circle
            </div>
          </lfPopup>
          <lfTooltip>
            <>lfCircle</>
          </lfTooltip>
        </lfCircle>
      )}
    </LeafletMap>
  )
}

describe('svg.cy.ts', () => {
  it('prestine snapshot matches', () => {
    cy.mount(<SvgLayers zPosition='bottom' />)
    cy.compareSnapshot('prestine')
  })

  it('snapshot matches after changing the z-position of svg element', () => {
    cy.mount(<SvgLayers zPosition='bottom' />)
      .then((mounted) => {
        mounted.rerender(<SvgLayers zPosition='top' />)
        cy.compareSnapshot('zposition-change')
      })
  })

  it('layer additions work inside of lfCircle', () => {
    cy.mount(<SvgLayers zPosition='top' />)
    cy.get("[data-testid='lfCircle']").click()
    cy.compareSnapshot('circle-popup-tooltip')
  })

  it('layer additions work inside of lfRectangle', () => {
    cy.mount(<SvgLayers zPosition='bottom' />)
    cy.get("[data-testid='lfRectangle']").click()
    cy.compareSnapshot('rectangle-popup-tooltip')
  })

  it('layer additions work inside of lfPolygon', () => {
    cy.mount(<SvgLayers zPosition='bottom' />)
    cy.get("[data-testid='lfPolygon']").click({ force: true })
    cy.compareSnapshot('polygon-popup-tooltip')
  })

  it('layer additions work inside of lfPolyline', () => {
    cy.mount(<SvgLayers zPosition='bottom' />)
    cy.get("[data-testid='lfPolyline']").click()
    cy.compareSnapshot('polyline-popup-tooltip')
  })

  // TODO: add more tests for events. Since leaflet events are mostly the same across all leaflet object, then perhaps we should find a common technique to simplify this
})
