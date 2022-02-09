/**
 * Get HtmlWebpackPlugin custom template parameters.
 * 
 * @param {object} compilation The webpack compiler.
 * @param {object} assets      All javascript and css files.
 * @param {object} assetsTags  The head and body tag arrays.
 * @param {object} options     The template options.
 * 
 * @return {object}
 */
function getTemplateParams( compilation, assets, assetTags, options )
{
	let chunks = {};

	for ( const chunk of compilation.chunks ) {
		// Get associated cache data
		let runtime = [];
		if ( typeof chunk.runtime === 'string' ) {
			runtime.push( chunk.runtime );
		} else {
			for ( const prop of chunk.runtime ) {
				if ( typeof prop === 'string' ) runtime.push( prop );
			}
		}

		// Get associated files
		let files = [];
		for ( const file of chunk.files ) {
			if ( typeof file === 'string' ) files.push( assets.publicPath + file );
		}

		chunks[ chunk.id ] = {
			entry: runtime,
			files,
			hash: chunk.hash,
			name: chunk.name || false
		};
	}

	return {
		compilation,
		webpackConfig: compilation.options,
		htmlWebpackPlugin: {
			tags: assetTags,
			files: assets,
			chunks,
			options
		}
	};
}

module.exports = { getTemplateParams };