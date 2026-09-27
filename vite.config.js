import {defineConfig} from 'vite';

// React's own JSX transform is handled by esbuild; no plugin needed for this project.
export default defineConfig({
  esbuild: {jsx: 'automatic'},
  build: {
    target: 'es2020',
    cssMinify: true,
    rollupOptions: {
      output: {
        // Keep React in its own long-cached chunk so site edits don't bust it.
        manualChunks(id) {
          if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react';
        }
      }
    }
  }
});
