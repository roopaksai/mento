// Vite config - references actual config in requirements/config/import { defineConfig } from 'vite'import { defineConfig } from 'vite'

module.exports = require('./requirements/config/vite.config.js');
import react from '@vitejs/plugin-react'import react from '@vitejs/plugin-react'



export default defineConfig({export default defineConfig({

  plugins: [react()],  plugins: [react()],

  server: {  server: {

    port: 3000,    port: 3000,

    open: true    open: true

  },  },

  build: {  build: {

    outDir: 'dist'    outDir: 'dist'

  }  }

})})