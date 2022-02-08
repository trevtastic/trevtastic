module.exports = function ( eleventyConfig ) {

	// plugins
	const markdownIt = require( 'markdown-it' );
	const markdowItAttrs = require( 'markdown-it-attrs' );
	const markdownItReplaceLink = require( 'markdown-it-replace-link' );

	// options
	const markdowItOpts = {
		html: true, // enable HTML tags in source.
		breaks: true,
		linkify: true,
		replaceLink: function ( link, env ) { // format links

			preRegex  = /^(?:http[s]*:\/\/|mailto:|\/|#).+$/i;
			postRegex = /(?:index)*\.m(?:d|md|kd|arkdown)$/;

			if ( preRegex.test( link ) ) {
				return link; // do nothing
			} else if ( postRegex.test( link ) ) {
				link = '/' + link.replace( postRegex, '' ); // + env.page.outputFileExtension
			} else {
				link = '/' + link;
			}

			// debug
			console.log( link );

			return link;
		}
	};

	// init plugins
	const markdownLib = (
		markdownIt( markdowItOpts )
			.use( markdowItAttrs )
			.use( markdownItReplaceLink )
	);

	// set 11ty config and register plugins
	eleventyConfig.addPassthroughCopy( { 'src/assets/img': 'assets/img' } );
	eleventyConfig.setLibrary( 'md', markdownLib );

	// return config
	return {
		dir: {
			input:   'src/content',
			output:  'docs',
			layouts: '_layouts'
		},
		markdownTemplateEngine: 'njk'
	};

};