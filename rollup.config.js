import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const umdModuleName = 'PropFilter';
const inputSource = 'src/PropFilter.mjs';
const inputSourceLodashStandalone = 'src/PropFilter.lodash-standalone.mjs';

const dist = (name) => {
	return `dist/${name}`;
};

export default [
	{
		input:   inputSource,
		output:  [
			{file: 'index.js', format: 'cjs', sourcemap: true, interop: false},
		],
		plugins: [
			babel({
				presets: [
					[
						'@babel/preset-env',
						{
							useBuiltIns: false
						}
					]
				],
				exclude: 'node_modules/**'
			})
		]
	},
	{
		input:   inputSourceLodashStandalone,
		output:  [
			{file: 'dist/prop-filter.lodash-standalone.js', format: 'cjs', sourcemap: true, interop: false},
			{file: 'dist/prop-filter.lodash-standalone.umd.js', format: 'umd', sourcemap: true, name: umdModuleName},
		],
		plugins: [
			resolve({
				only: [ 'deepmerge', 'typechecker', 'php-trim-plus' ], // Default: null
			}),
			commonjs(),
			babel({
				presets: [
					[
						'@babel/preset-env',
						{
							useBuiltIns: false
						}
					]
				],
				exclude: 'node_modules/**'
			})
		]
	},
];