import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/** @type {import('vite').BuildOptions} */
export default defineConfig({
  // disabled fastRefresh. It fixes a problem that reads "preemble code is missing"... which comes from @vitejs/plugin-react
  plugins: [react({ fastRefresh: false })]
})
