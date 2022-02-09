module.exports = {
	env: {
		browser: true,
		es6: true,
		node: true
	},
	extends: [
		'eslint:recommended',
		'plugin:react/recommended'
	],
	globals: {
		Atomics: 'readonly',
		jQuery: 'readonly',
		SharedArrayBuffer: 'readonly',
		wp: 'readonly',
	},
	parser: '@babel/eslint-parser',
	parserOptions: {
		ecmaFeatures: {
			jsx: true
		},
		ecmaVersion: 2018,
		sourceType: 'module'
	},
	plugins: [
		'@babel',
		'react'
	],
	rules: {
		'no-console': 'off',
		'no-unused-vars': 'off',
		'react/display-name': 'off',
		'react/prop-types': 'off',
		'react/react-in-jsx-scope': 'off',
		'@babel/new-cap': 'error', // handles decorators (@Decorator)
		'@babel/no-invalid-this': 'error', // handles class fields and private class methods
		'@babel/no-unused-expressions': 'error', // handles do expressions
		'@babel/object-curly-spacing': 'error', // handles export * as x from "mod";
		'@babel/semi': 'error', // Handles class properties
	},
	settings: {
		'react': {
			version: 'detect'
		}
	}
};