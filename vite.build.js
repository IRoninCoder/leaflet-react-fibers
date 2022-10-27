import Path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

/** @type {import('vite').BuildOptions} */
export default defineConfig({
  plugins: [
    react(),
    dts({
      exclude: ['node_modules', 'typings'],
      insertTypesEntry: true
    })
  ],
  build: {
    minify: false,
    lib: {
      entry: Path.resolve(__dirname, 'lib/index.ts'),
      name: 'index',
      fileName: 'index'
    },
    rollupOptions: {
      external: [
        'leaflet',
        'react',
        'react/jsx-runtime',
        'scheduler',
        'scheduler/tracing',
        'leaflet/dist/leaflet.css',
        'leaflet/dist/images/marker-icon.png',
        'leaflet/dist/images/marker-shadow.png'
      ],
      output: {
        globals: {
          leaflet: 'L',
          react: 'React',
          scheduler: 'ReactScheduler',
          'scheduler/tracing': 'ReactSchedulerTracing',
          'react/jsx-runtime': 'jsx',
          'leaflet/dist/images/marker-icon.png': 'MarkerIcon',
          'leaflet/dist/images/marker-shadow.png': 'MarkerShadow'
        }
      }
    }
  }
})
