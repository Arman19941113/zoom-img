import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import gzipPlugin from 'rollup-plugin-gzip'
import replace from '@rollup/plugin-replace'
import rollupPostcss from 'rollup-plugin-postcss'
import postcssNested from 'postcss-nested'
// @ts-ignore
import postcssPresetEnv from 'postcss-preset-env'
// @ts-ignore
import cssnano from 'cssnano'

export default [{
  input: 'src/index.ts',
  output: {
    name: 'handleImageZoom',
    file: 'npm/dist/index.iife.js',
    format: 'iife',
  },
  plugins: [
    nodeResolve(),
    replace({
      'process.env.NODE_ENV': '\'production\'',
    }),
    typescript(),
  ],
}, {
  input: 'src/index.ts',
  output: {
    name: 'handleImageZoom',
    file: 'npm/dist/index.iife.min.js',
    format: 'iife',
  },
  plugins: [
    nodeResolve(),
    replace({
      'process.env.NODE_ENV': '\'production\'',
    }),
    typescript(),
    terser(),
    gzipPlugin(),
  ],
}, {
  input: 'src/index.css',
  output: {
    file: 'npm/dist/index.css',
    format: 'es',
  },
  plugins: [
    rollupPostcss({
      extract: true,
      plugins: [
        postcssNested,
        postcssPresetEnv({
          stage: 0,
        }),
        cssnano,
      ],
    }),
  ],
}]
