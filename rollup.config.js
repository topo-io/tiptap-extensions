import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import ts from "rollup-plugin-ts";

const packages = [
  'packages/column-extension'
];

const config = [];

packages.forEach((pkg) => {
  config.push({
    input: `${pkg}/src/index.ts`,
    output: [
      {
        file: `${pkg}/dist/bundle.cjs.js`,
        format: 'cjs',
        exports: 'auto',
      },
      {
        file: `${pkg}/dist/bundle.es.js`,
        format: 'es'
      },
      {
        file: `${pkg}/dist/bundle.umd.js`,
        name: 'column-extension',
        format: 'umd'
      }
    ],
    plugins: [
      resolve(),
      commonjs(),
      ts({
        tsconfig: config => ({...config, "declaration": true })
      }),
    ]
  })
})

export default config;
