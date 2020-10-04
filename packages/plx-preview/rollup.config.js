import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import bundleSize from 'rollup-plugin-size';
import sourcemaps from 'rollup-plugin-sourcemaps';

const production = !process.env.ROLLUP_WATCH;

const terserPlugin = terser({
  sourcemap: true,
  warnings: true,
  compress: {
    passes: 2,
    drop_console: production,
  },
  mangle: {
    properties: {
      regex: /^_\w/
    }
  }
});

const config = {
  input: 'src/preview.js',
  watch: {
    clearScreen: false
  },
  output: {
    format: 'es',
    sourcemap: true,
    file: 'esm/preview.js',
    globals: { '@playerx/player': 'playerx' },
  },
  external: ['@playerx/player'],
  plugins: [
    bundleSize(),
    sourcemaps(),
    nodeResolve(),
  ]
};

export default [
  config,
  production && {
    ...config,
    output: {
      ...config.output,
      file: 'esm/preview.min.js',
      format: 'es'
    },
    plugins: [
      ...config.plugins,
      terserPlugin,
    ]
  },
  production && {
    ...config,
    output: {
      ...config.output,
      file: 'umd/preview.js',
      format: 'umd',
      name: 'plxPreview',
    },
    plugins: [
      ...config.plugins,
      babel({
        babelHelpers: 'bundled',
        include: '**/*',
        inputSourceMap: false,
        compact: false,
      }),
      terserPlugin,
    ]
  },
].filter(Boolean);