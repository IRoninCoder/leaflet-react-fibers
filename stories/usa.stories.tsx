import React from 'react'

import './storybook.css'

import { LeafletMap } from '../lib'
import USA, { USAProps, USAPropsDefaults } from '../examples/usa'

export const UnitedStates = ({ isVisible, zPosition, geoJson, mutability, wyomingColor }: USAProps) => {
  return (
    <USA geoJson={geoJson} isVisible={isVisible} mutability={mutability} zPosition={zPosition} wyomingColor={wyomingColor} />
  )
}

export default {
  title: 'Maps/United States',
  component: LeafletMap,
  argTypes: {
    zPosition: {
      options: ['bottom', 'middle', 'top'],
      control: { type: 'select' },
      name: 'Location of extended wyoming along the z-axis',
      table: {
        type: { summary: 'The layer will be shifting up/down along the z axis when changing this value.' },
        defaultValue: { summary: USAPropsDefaults.zPosition }
      }
    },
    isVisible: {
      name: 'Wyoming is visible or not',
      table: {
        type: { summary: 'Show or hide the wyoming.' },
        defaultValue: { summary: USAPropsDefaults.isVisible }
      }
    },
    mutability: {
      name: 'Mutability for all layers',
      table: {
        type: { summary: 'Setting this to false will prevent further changes on layers, that is, changing layer specific properties will have no effect. Mutability control is configured per layer or layer groups. Does not affect z-position since that is handled differently for demonstration purposes.' },
        defaultValue: { summary: USAPropsDefaults.mutability }
      }
    },
    wyomingColor: {
      name: 'Color of Wyoming',
      control: 'color',
      table: {
        type: { summary: 'Choose a color for Wymoing. Switch mutability and try again to see the effect.' },
        defaultValue: { summary: USAPropsDefaults.wyomingColor }
      }
    },
    geoJson: {
      name: 'Geo JSON data for all states',
      table: {
        type: { summary: 'Live data structure which is displayed in the map. Changing this data is reflected on the map immediately. For example deleting a state or adding a new state.' },
        defaultValue: { summary: USAPropsDefaults.geoJson }
      }
    }
  },
  args: USAPropsDefaults,
  parameters: {
    controls: { expanded: true },
    docs: {
      description: {
        component:
          `
This story shows map of USA. In addition:
- Demonstrates the conditional rendering of layers provided by this library.
- Usage of \`<MapContext>\` for child layers which require direct access to the leaflet map object.
- How to do customization over geoJson data by adding state labels which are resizable according to zoom levels.
        `
      }
    }
  }
}
