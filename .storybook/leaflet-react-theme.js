import { create } from '@storybook/theming';

// setup the theme based on browser preference
let base = 'light'
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  base = 'dark'
}

// resize the nav panel on the left to be a bit larger
let storybookConfig = JSON.parse(localStorage.getItem('storybook-layout'));

if (storybookConfig && storybookConfig.resizerNav.x < 320) {
  storybookConfig.resizerNav.x = 320;
  localStorage.setItem('storybook-layout', JSON.stringify(storybookConfig));
  document.location.reload();
}

// resize the properties panell at the bottom
if (storybookConfig && storybookConfig.resizerPanel.y > 600) {
  storybookConfig.resizerPanel.y = 600;
  localStorage.setItem('storybook-layout', JSON.stringify(storybookConfig));
  document.location.reload();
}

// new settings if localStorage is empty
if (!storybookConfig) {
  storybookConfig = { resizerNav: { x: 320, y: 0 }, resizerPanel: { x: 0, y: 600 } };
  localStorage.setItem('storybook-layout', JSON.stringify(storybookConfig));
  document.location.reload();
}

export default create({
  base,
  brandUrl: 'https://github.com/chickencoding123/leaflet-react-fibers',
  brandTitle:
    `<span style="display: block">
      <span style="display: flex; align-items: center; justify-content: center; margin-bottom: 0.25rem;">
        <img src="/leaflet-react-fibers.png" style="width: 1.25rem; margin-right: 0.5rem;"/> 
        leaflet-react-fibers
      </span>
      <span style="font-size: x-small; font-weight: normal; display: flex; align-items: center; justify-content: center">
        <img src="/github-icon.png" style="width: 0.8rem; margin-right: 0.5rem; ${base === 'dark' ? 'filter: invert(1)' : ''}"/> 
        Click for github
      </span>
    </span>`
});