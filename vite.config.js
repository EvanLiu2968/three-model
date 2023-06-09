import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';

function pathResolve(dir) {
  return path.resolve(process.cwd(), '.', dir);
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: /@\//,
        replacement: pathResolve('src') + '/',
      }
    ]
  }
})
