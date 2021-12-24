import L from 'leaflet'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import Renderer from './renderer'
import { CustomMapOptions } from './types'

const mapOpts: CustomMapOptions = {
	crs: L.CRS.Simple,
	minZoom: 1,
	maxZoom: 10,
	maxBounds: [[0, 0], [500, 500]],
	zoom: 1,
	zoomControl: false,
	maxBoundsViscosity: 1,
	attributionControl: false
}

function getDOM() {
	const div = document.createElement('div')
	div.innerHTML = `
    <div id="map-test"></div>
  `
	return div
}

// https://reactjs.org/link/mock-scheduler
jest.mock('scheduler', () => require('scheduler/unstable_mock'));

test('can render a map with a single layer', async () => {
	// const tree = (
	// 	<lfMap options={mapOpts}>
	// 		<lfRectangle bounds={[[0, 0], [500, 500]]}></lfRectangle>
	// 	</lfMap>
	// )
	// const dom = getDOM()
	// Renderer.render(tree, dom, (el, container) => render(el, { container }).baseElement)
	// expect(dom).toHaveTextContent('Hello world')
	console.log('Work in progress, tests are not wroking yet')
})