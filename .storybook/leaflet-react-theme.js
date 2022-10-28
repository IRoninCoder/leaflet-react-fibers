import { create } from '@storybook/theming';

import GithubIconUrl from '../stories/assets/github-icon.png'
import LeafletReactFibersIconUrl from '../stories/assets/leaflet-react-fibers.png'

// setup the theme based on browser preference
let base = 'light'
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  base = 'dark'
}

// Calculate bottom panel's height
const heightDiv = document.createElement('div')
heightDiv.style.height = '64vh'
document.body.appendChild(heightDiv)
const y = heightDiv.clientHeight
document.body.removeChild(heightDiv) 

// Calculate side panel's width
const widthDiv = document.createElement('div')
widthDiv.style.width = '16vw'
document.body.appendChild(widthDiv)
const x = widthDiv.clientWidth
document.body.removeChild(widthDiv) 

// resize the nav panel on the left to be a bit larger
let storybookConfig = JSON.parse(localStorage.getItem('storybook-layout'))

if (storybookConfig && storybookConfig.resizerNav.x < x) {
  storybookConfig.resizerNav.x = x
  localStorage.setItem('storybook-layout', JSON.stringify(storybookConfig))
  document.location.reload()
}

// resize the properties panell at the bottom
if (storybookConfig && storybookConfig.resizerPanel.y > y) {
  storybookConfig.resizerPanel.y = y
  localStorage.setItem('storybook-layout', JSON.stringify(storybookConfig))
  document.location.reload()
}

// new settings if localStorage is empty
if (!storybookConfig) {
  storybookConfig = { resizerNav: { x, y: 0 }, resizerPanel: { x: 0, y } }
  localStorage.setItem('storybook-layout', JSON.stringify(storybookConfig))
  document.location.reload()
}

export default create({
  base,
  brandUrl: 'https://github.com/chickencoding123/leaflet-react-fibers',
  brandTitle:
    `<span style="display: block">
      <span style="display: flex; align-items: center; justify-content: center; margin-bottom: 0.25rem;">
        <img src="${LeafletReactFibersIconUrl}" style="width: 1.25rem; margin-right: 0.5rem;"/> 
        leaflet-react-fibers
      </span>
      <span style="font-size: x-small; font-weight: normal; display: flex; align-items: center; justify-content: center">
        <img src="${GithubIconUrl}" style="width: 0.8rem; margin-right: 0.5rem; ${base === 'dark' ? 'filter: invert(1)' : ''}"/> 
        Click for github
      </span>
    </span>`
})
