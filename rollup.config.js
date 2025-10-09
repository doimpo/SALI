import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from '@rollup/plugin-terser';

export default [
  // Main bundle
  {
    input: 'src/js/main-modular.js',
    output: {
      file: 'public/assets/js/main-modular.js',
      format: 'es',
      sourcemap: true
    },
    plugins: [
      nodeResolve(),
      terser({
        compress: {
          drop_console: true,
          drop_debugger: true
        },
        mangle: true
      })
    ]
  },
  
  // Legacy bundle for older browsers
  {
    input: 'src/js/main-modular.js',
    output: {
      file: 'public/assets/js/main-modular-legacy.js',
      format: 'iife',
      name: 'SALiApp',
      sourcemap: true
    },
    plugins: [
      nodeResolve(),
      terser({
        compress: {
          drop_console: false,
          drop_debugger: false
        },
        mangle: false
      })
    ]
  },

  // Component modules (separate bundles)
  {
    input: 'src/js/modules/ComponentLoader.js',
    output: {
      file: 'public/assets/js/modules/ComponentLoader.js',
      format: 'es',
      sourcemap: true
    },
    plugins: [
      nodeResolve(),
      terser()
    ]
  },

  {
    input: 'src/js/modules/PerformanceMonitor.js',
    output: {
      file: 'public/assets/js/modules/PerformanceMonitor.js',
      format: 'es',
      sourcemap: true
    },
    plugins: [
      nodeResolve(),
      terser()
    ]
  }
];
