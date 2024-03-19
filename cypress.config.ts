import { defineConfig } from 'cypress'
import { configureVisualRegression } from 'cypress-visual-regression/dist/plugin'

export default defineConfig({
  video: false,
  screenshotOnRunFailure: false,
  screenshotsFolder: './cypress/snapshots/actual',
  trashAssetsBeforeRuns: true,
  component: {
    env: {
      visualRegressionBaseDirectory: './cypress/snapshots/base',
      visualRegressionDiffDirectory: './cypress/snapshots/diff'
    },
    devServer: {
      framework: 'react',
      bundler: 'vite'
    },
    setupNodeEvents(on) {
      configureVisualRegression(on)
    }
  }
})
