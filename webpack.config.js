'use strict';

// load node path module
const path = require( 'path' );

// load plugins
const autoprefixer = require( 'autoprefixer' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const CssMinimizerPlugin = require( 'css-minimizer-webpack-plugin' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const TerserPlugin = require( 'terser-webpack-plugin' );
const webpack = require( 'webpack' );

// load custom modules
const custom = require( './scripts' );

// Custom params
const timeStamp = new Date().getTime();
const cssDest = '/assets/css/gen/';
const jsDest = '/assets/js/gen/';
const jsLib = '/assets/js/lib';
const touchIconDest = '/assets/img/common/touch';
const favIconDest = '/assets/img/common/favicon';

// define entry point descriptor
const entries = {
	app: {
		import: 'src/js/app',
		destCSS: `${cssDest}`,
		destJS: `${jsDest}`
	},
	bundle: {
		destCSS: `${cssDest}`,
		destJS: `${jsDest}`
	},
	common: {
		import: 'src/js/common',
		destCSS: `${cssDest}`,
		destJS: `${jsDest}`
	},
	vendor: {
		destCSS: `${cssDest}`,
		destJS: `${jsDest}`
	}
};

// List of template links
const htmlLinks = [
	{
		rel: 'apple-touch-icon',
		sizes: '180x180',
		href: `${touchIconDest}/apple-touch-icon.png?v=${timeStamp}`
	},
	{
		rel: 'apple-touch-startup-image',
		media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)',
		href: `${touchIconDest}/apple-launch-640x1096.png?v=${timeStamp}`
	},
	{
		rel: 'apple-touch-startup-image',
		media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)',
		href: `${touchIconDest}/apple-launch-640x1136.png?v=${timeStamp}`
	},
	{
		rel: 'icon',
		type: 'image/png',
		sizes: '180x180',
		href: `${favIconDest}/favicon-180x180.png?v=${timeStamp}`
	},
	{
		rel: 'icon',
		type: 'image/png',
		sizes: '96x96',
		href: `${favIconDest}/favicon-96x96.png?v=${timeStamp}`
	},
	{
		rel: 'icon',
		type: 'image/png',
		sizes: '32x32',
		href: `${favIconDest}/favicon-32x32.png?v=${timeStamp}`
	},
	{
		rel: 'icon',
		type: 'image/png',
		sizes: '16x16',
		href: `${favIconDest}/favicon-16x16.png?v=${timeStamp}`
	},
	{
		rel: 'manifest',
		href: `/manifest.json?v=${timeStamp}`
	},
	{
		rel: 'mask-icon',
		color: '#f62b54',
		href: `${touchIconDest}/safari-pinned-tab.svg?v=${timeStamp}`
	},
	{
		rel: 'shortcut icon',
		href: `/favicon.ico?v=${timeStamp}`
	}
];

// Meta content
const metadata = [
	{
		name: 'description',
		content: 'Welcome to my online software development portfolio.'
	},
	{
		name: 'keywords',
		content: 'web development, software development, software engineering'
	},
	{
		name: 'msapplication-config',
		content: '/browserconfig.xml'
	},
	{
		name: 'theme-color',
		content:'#000000'
	},
	{
		name: 'apple-mobile-web-app-capable',
		content: 'yes'
	},
	{
		name: 'apple-mobile-web-app-status-bar',
		content: '#000000'
	},
	{
		name: 'apple-mobile-web-app-status-bar-style',
		content: 'black' // default, black, black-translucent
	},
	{
		name: 'apple-mobile-web-app-title',
		content: 'Trevor Chigonda'
	},
	{
		property: 'og:site_name',
		content: 'Trevor Chigonda'
	},
	{
		property: 'og:image_secure',
		content: `https://ebenezer.umyf.co.uk/images/assets/bg/site-poster.jpg?v=${timeStamp}`
	},
	{
		property: 'og:title',
		content: 'Trevor Chigonda | Web development'
	},
	{
		property: 'og:description',
		content: 'Web development online portfolio.'
	},
	{
		property: 'og:type',
		content: 'website'
	},
	{
		property: 'og:url',
		content: 'https://trevorchigonda.com'
	}
];

// Module export
module.exports = function ( env, argv ) {

	// define environment
	const devMode = argv.mode !== 'production';

	// define namespace
	const prefix = '';
	const minSuffix = ( ! devMode ) ? '.min' : '';
	const chunkSuffix = ( devMode ) ? '.[chunkhash]' : '';

	// project config
	const config = {

		devtool: false, // how to generate source maps

		entry: (() => {
			let all = {};
			for ( let entry in entries ) {
				if ( Object.prototype.hasOwnProperty.call( entries, entry ) && entries[ entry ].import ) {
					all[ `${entry}` ] = {
						import: entries[ entry ].import,
						filename: `${prefix}.[name]${minSuffix}${chunkSuffix}.js`
					};
				}
			}
			return all;
		})(),

		externals: {
			jquery: 'jQuery',
			lodash: 'lodash',
			underscore: '_'
		},

		// mode: "production", // 'none' | 'development' | 'production',

		module: {
			rules: [
				{
					test: /\.jsx?$/, // match both .js and .jsx files
					exclude: [ /node_modules/, /.+\.config.js/ ],
					use: {
						loader: 'babel-loader',
						options: {
							presets: [
								[
									'@babel/preset-env',
									{
										ignoreBrowserslistConfig: false,
										browserslistEnv: 'modern',
										debug: devMode,
										useBuiltIns: 'usage',
										corejs: '3.21'
									}
								],
								[
									'@babel/preset-react',
									{
										development: devMode
									}
								]
							],
							plugins: []
						}
					}
				},
				{
					test: /\.(sa|sc|c)ss$/, // match both .sass and .scss files
					use: [
						{
							loader: MiniCssExtractPlugin.loader
						},
						{
							loader: 'css-loader',
							options: { url: false }
						},
						{
							loader: 'postcss-loader',
							options: {
								postcssOptions: {
									plugins: [
										[
											autoprefixer,
											{
												env: 'modern'
											}
										]
									]
								}
							}
						},
						{
							loader: 'sass-loader'
						}
					] // Loaders are applied from last to first
				},
				{
					test: /\.(jpe?g|png|gif|svg)$/, // match jpg, jpeg, png, gif and svg files
					use: {
						loader: 'url-loader',
						options: {
							limit: 40000,
							outputPath: path.resolve( __dirname, 'src/dist/images' ),
						}
					}
				}
			]
		},

		optimization: {
			chunkIds: "deterministic",
			splitChunks: {
				chunks: 'all',
				automaticNameDelimiter: '.',
				cacheGroups: {
					vendor: {
						name: 'vendor',
						test: /[\\/]node_modules[\\/]/,
						filename: `${prefix}.[name]${minSuffix}${chunkSuffix}.js`
					},
					bundle: {
						name: 'bundle',
						test: function ( module, chunks ) {
							const paths = [
								path.resolve( __dirname, 'src/js/util' )
							];

							if ( module.resource != undefined )
							{
								for ( let item of paths ) {
									if ( module.resource.includes( item ) ) return true;
								}
							}

							return false;
						},
						minChunks: 1,
						filename: `${prefix}.[name]${minSuffix}${chunkSuffix}.js`
					}
				}
			},
			minimizer: [
				new TerserPlugin({
					parallel: true,
					terserOptions: {
						compress: true,
						ecma: 6,
						mangle: true
					}
				}),
				new CssMinimizerPlugin({
					minimizerOptions: {
						preset: [
							'default',
							{
								discardComments: { removeAll: true }
							}
						]
					}
				})
			]
		},

		output: {
			filename: `${prefix}.[name]${minSuffix}${chunkSuffix}.js`,
			path: path.resolve( __dirname, 'src/dist' ), // the target directory for all output files
			// publicPath: '/'
		},

		performance: {
			hints: ! devMode ? 'warning' : false
		},

		plugins: [
			// Write out our compiled .js scripts to html page
			new HtmlWebpackPlugin({
				appMountId: 'appMountPoint',
				devMode,
				entries,
				filename: 'base-legacy.njk',
				inject: false,
				links: [
					htmlLinks[ 9 ]
				],
				meta: [
					metadata[ 0 ],
					metadata[ 1 ]
				],
				minify: {
					collapseInlineTagWhitespace: false,
					collapseWhitespace: false,
					keepClosingSlash: true, // for xhtml
				},
				mobile: true,
				prefix,
				scripts: [
					{
						type: 'text/javascript',
						src: ( ! devMode ? jsLib + '/jquery-1.12.4.min.js' : jsLib + '/jquery-1.12.4.js' )
					}
				],
				template: 'src/templates/base-legacy.ejs',
				templateParameters: custom.getTemplateParams,
				timeStamp
			}),
			new HtmlWebpackPlugin({
				appMountId: 'appMountPoint',
				devMode,
				entries,
				filename: 'base-common.njk',
				inject: false,
				links: htmlLinks,
				meta: metadata,
				minify: {
					collapseInlineTagWhitespace: false,
					collapseWhitespace: false,
				},
				mobile: true,
				prefix,
				scripts: [
					{
						type: 'text/javascript',
						src: ( ! devMode ? jsLib + '/jquery-3.5.1.min.js' : jsLib + '/jquery-3.5.1.js' )
					}
				],
				template: 'src/templates/base-common.ejs',
				templateParameters: custom.getTemplateParams,
				timeStamp
			}),
			new HtmlWebpackPlugin({
				appMountId: 'appMountPoint',
				devMode,
				entries,
				filename: 'base.ejs',
				inject: false,
				links: htmlLinks,
				meta: metadata,
				minify: {
					collapseInlineTagWhitespace: false,
					collapseWhitespace: false,
				},
				mobile: true,
				prefix,
				scripts: [
					{
						type: 'text/javascript',
						src: ( ! devMode ? jsLib + '/jquery-3.5.1.min.js' : jsLib + '/jquery-3.5.1.js' )
					}
				],
				template: 'src/templates/base.ejs',
				templateParameters: custom.getTemplateParams,
				timeStamp
			}),
			
			// Extract css
			new MiniCssExtractPlugin({
				filename: `${prefix}.[name]${minSuffix}${chunkSuffix}.css`
			}),

			// Generate source maps
			! devMode ? new webpack.SourceMapDevToolPlugin({
				append: '\n//# sourceMappingURL=[url]',
				exclude: [ new RegExp( `${prefix}\.vendor\.[a-z0-9]+\.js` ) ],
				filename: `${prefix}.[name]${minSuffix}${chunkSuffix}.[ext].map`
			}) : function() {}
		],

		resolve: {
			extensions: [ '.js', '.jsx' ],
			modules: [
				path.resolve( __dirname, 'src/js' ),
				path.resolve( __dirname, 'node_modules' )
			],
			alias: {
				App: path.resolve( __dirname, 'src/js/app' ),
				Common: path.resolve( __dirname, 'src/js/common' ),
				Legacy: path.resolve( __dirname, 'src/js/legacy' ),
				Scss: path.resolve( __dirname, 'src/scss' ),
				Util: path.resolve( __dirname, 'src/js/util' ),
				Workers: path.resolve( __dirname, 'src/js/workers' )
			}
		},

	};

	return config;
};