import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'

import rollupPostcss from 'rollup-plugin-postcss'
import postcssPresetEnv from 'postcss-preset-env'
import postcssNested from 'postcss-nested'
import cssnano from 'cssnano'

const browserTask = {
  input: 'src/index.ts',
  output: {
    name: 'zoomImg',
    file: 'dist/index.global.js',
    format: 'iife',
  },
  plugins: [
    typescript({
      compilerOptions: {
        removeComments: true,
      },
    }),
    terser(),
  ],
}

const jsTasks = {
  input: 'src/index.ts',
  external: ['@vue/runtime-core'],
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
    },
    {
      file: 'dist/index.esm.js',
      format: 'es',
    },
  ],
  plugins: [
    typescript({
      compilerOptions: {
        removeComments: true,
      },
    }),
  ],
}

const cssTask = {
  input: 'src/index.css',
  output: {
    file: 'dist/index.css',
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
}

export default [
  browserTask,
  jsTasks,
  cssTask,
]
