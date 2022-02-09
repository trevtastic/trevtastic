// Import vendor modules

const { dest, series, src } = require( 'gulp' );
const argv = require( 'yargs' ).argv; // May need to install yargs if not already there.
const autoprefixer = require( 'autoprefixer' );
const babel = require( 'gulp-babel' );
const concat = require( 'gulp-concat' );
const cssnano = require( 'cssnano' );
const del = require( 'del' );
const Fiber = require( 'fibers' );
const gulpif = require( 'gulp-if' );
const postcss = require( 'gulp-postcss' );
const rename = require( 'gulp-rename' );
const sass = require( 'gulp-sass' )( require( 'sass' ) );
const terser = require( 'gulp-terser' );

// Common variables
const resolve = {
	publicPath:  'docs',
	srcPath:     'src',
	cssDestPath: '/assets/css/gen',
	jsDestPath:  '/assets/js/gen',
	distPath:    '/dist',
	jsPath:      '/js',
	scssPath:    '/scss',
	workersPath: '/workers',
	jsEntry: {
		app: '/app',
		common: '/common',
		legacy: '/legacy',
		util: '/util',
		worker: '/workers'
	}
};

// Define environment
function getEnv()
{
	return argv.mode !== 'production';
}

// Copy tasks

function copyAllCssTask()
{
	return src(
		resolve.srcPath + resolve.distPath + '/**/*.css*'
	)
	.pipe( dest( resolve.publicPath + resolve.cssDestPath ) );
}

function copyAllJsTask()
{
	return src(
		resolve.srcPath + resolve.distPath + '/**/*.js*'
	)
	.pipe( dest( resolve.publicPath + resolve.jsDestPath ) );
}

function copyTemplatesTask()
{
	return src([
		resolve.srcPath + resolve.distPath + '/**/*.njk*',
		`!${resolve.srcPath}${resolve.distPath}/**/*.css*`,
		`!${resolve.srcPath}${resolve.distPath}/**/*.js*`
	])
	.pipe( dest( resolve.srcPath + '/content/_layouts' ) );
}

// Cleanup tasks

function cleanTask()
{
	return del([
		resolve.publicPath + resolve.cssDestPath + '/**/*.css*', // delete all .css and sourcemaps in the public `css` folder
		resolve.publicPath + resolve.jsDestPath + '/**/*.js*', // delete all .js and sourcemaps in the public `js` folder
		resolve.srcPath + resolve.distPath + '/**/*', // delete everything in the `dist` folder
	]);
}

// Sass tasks

function scssTask() 
{
	const devMode = getEnv();

	let postModules = [
		autoprefixer({
			env: 'legacy'
		})
	];
	
	if ( ! devMode )
	{
		postModules.push(
			cssnano({
				preset: [
					'default',
					{
						discardComments: { removeAll: true }
					}
				]
			})
		);
	}

	return src(
		[ `${resolve.srcPath}${resolve.scssPath}/bootstrap-3/**/*.scss` ],
		{ sourcemaps: ! devMode }
	)
	.pipe( sass( { fiber: Fiber } ).on( 'error', sass.logError ) )
	.pipe( postcss( postModules ) )
	.pipe( gulpif( ! devMode, rename({
		suffix: '.min',
		extname: '.css'
	})))
	.pipe( dest( resolve.srcPath + resolve.distPath, { sourcemaps: '.' } ) );
}

// Javascript tasks

function jsTask()
{
	const devMode = getEnv();

	return src(
		[
			resolve.srcPath + resolve.jsPath + resolve.jsEntry.legacy + '/index.js',
			// resolve.srcPath + resolve.jsPath + resolve.jsEntry.util + '/bootstrap/v3/transition.js',
			// resolve.srcPath + resolve.jsPath + resolve.jsEntry.util + '/bootstrap/v3/alert.js',
			// resolve.srcPath + resolve.jsPath + resolve.jsEntry.util + '/bootstrap/v3/button.js',
			// resolve.srcPath + resolve.jsPath + resolve.jsEntry.util + '/bootstrap/v3/carousel.js',
			// resolve.srcPath + resolve.jsPath + resolve.jsEntry.util + '/bootstrap/v3/collapse.js',
			// resolve.srcPath + resolve.jsPath + resolve.jsEntry.util + '/bootstrap/v3/dropdown.js',
			// resolve.srcPath + resolve.jsPath + resolve.jsEntry.util + '/bootstrap/v3/modal.js',
			// resolve.srcPath + resolve.jsPath + resolve.jsEntry.util + '/bootstrap/v3/tooltip.js',
			// resolve.srcPath + resolve.jsPath + resolve.jsEntry.util + '/bootstrap/v3/popover.js',
			// resolve.srcPath + resolve.jsPath + resolve.jsEntry.util + '/bootstrap/v3/scrollspy.js',
			// resolve.srcPath + resolve.jsPath + resolve.jsEntry.util + '/bootstrap/v3/tab.js',
			// resolve.srcPath + resolve.jsPath + resolve.jsEntry.util + '/bootstrap/v3/affix.js',
			resolve.srcPath + resolve.jsPath + resolve.jsEntry.legacy + '/main.js'
		],
		{ sourcemaps: ! devMode }
	)
	// .pipe( babel({
	// 	presets: [ '@babel/preset-env' ],
	// 	plugins: [ '@babel/plugin-proposal-object-rest-spread' ]
	// }))
	.pipe( concat( 'all.js' ) )
	.pipe( gulpif( ! devMode, terser( { ecma: 5 } ) ) )
	.pipe( gulpif( ! devMode, rename({
		suffix: '.min',
		extname: '.js'
	})))
	.pipe( dest( resolve.srcPath + resolve.distPath, { sourcemaps: '.' } ) );
}

// Web workers task

function swTask()
{
	const devMode = getEnv();

	return src(
		[
			resolve.srcPath + resolve.jsPath + resolve.workersPath + '/service/main.js'
		],
		{ sourcemaps: ! devMode }
	)
	.pipe( babel({
		presets: [ '@babel/preset-env' ],
		// plugins: [ '@babel/plugin-proposal-object-rest-spread' ]
	}))
	.pipe( concat( 'sw.js' ) )
	.pipe( gulpif( ! devMode, terser() ) )
	.pipe( gulpif( ! devMode, rename({
		suffix: '.min',
		extname: '.js'
	})))
	.pipe( dest( resolve.publicPath, { sourcemaps: '.' } ) );
}

exports.clean = cleanTask;
exports.default = series(
	scssTask,
	jsTask,
	swTask,
	copyAllCssTask,
	copyAllJsTask,
	copyTemplatesTask
);