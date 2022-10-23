import React from 'react'

import './storybook.css'

import { LeafletMap } from '../lib'
import Populated, { PopulatedPlacesProps, PopulatedPlacesPropsDefaults } from '../examples/populated-places'

export const PopulatedPlaces = ({ geoJson }: PopulatedPlacesProps) => {
  return (
    <Populated geoJson={geoJson} />
  )
}

export default {
  title: 'Maps/Populated Places',
  component: LeafletMap,
  argTypes: {
    geoJson: {
      name: 'Geo JSON data for populated places',
      table: {
        type: { summary: 'Live data structure which is displayed in the map. Changing this data is reflected on the map immediately.' },
        defaultValue: { summary: PopulatedPlacesPropsDefaults.geoJson }
      }
    }
  },
  args: PopulatedPlacesPropsDefaults,
  parameters: {
    controls: { expanded: true },
    docs: {
      description: {
        component:
          `
This story demonstrates how leaflet handles a large geojson data. It is useful for performance puproses. 
Typically we will use a geoJson layer like so:

\`<lfGeoJSON geojson={populatedGeoJson} />\`

Instead of a GeoJSON layer, we can just create \`<lfPolygone>\` layers directly and take advantage of fibers performance.
Unfortuantely this approach does not help with zooming performance.
        `
      }
    }
  }
}
