import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import replace from '@rollup/plugin-replace'
import rollupPostcss from 'rollup-plugin-postcss'
import postcssNested from 'postcss-nested'
import cssnano from 'cssnano'

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.cjs.js',
        format: 'cjs',
        exports: 'default',
      },
      {
        file: 'dist/index.esm.js',
        format: 'es',
      },
    ],
    external: ['@vue/runtime-core'],
    plugins: [
      typescript({
        compilerOptions: {
          removeComments: true,
        },
      }),
    ],
  },
  // for browser
  {
    input: 'src/index.ts',
    output: {
      name: 'handleImageZoom',
      file: 'dist/index.iife.js',
      format: 'iife',
    },
    plugins: [
      nodeResolve(),
      replace({
        'process.env.NODE_ENV': '\'production\'',
      }),
      typescript(),
      terser(),
    ],
  },
  // css file
  {
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
          cssnano,
        ],
      }),
    ],
  },
]
