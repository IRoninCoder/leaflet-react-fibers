import { create } from '@storybook/theming';

let base = 'light'
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  base = 'dark'
}

export default create({
  base,
  brandTitle: 'leaflet-react-fibers',
  brandUrl: 'https://github.com/chickencoding123/leaflet-react-fibers'
});