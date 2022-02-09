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
			imgRegex  = /[\w.-]+(?:jpg|png|gif|svg|webp)$/i;

			if ( preRegex.test( link ) ) { // resolve absolute links
				return link; // do nothing
			} else if ( postRegex.test( link ) ) { // resolve markdown file links
				link = '/' + link.replace( postRegex, '' ); // + env.page.outputFileExtension
			} else if ( match = link.match( imgRegex ) ) { // resolve images and icons
				link = '/assets/img/content/' + match[ 0 ];
			} else { // fallback
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
	eleventyConfig.addPassthroughCopy( { 'src/content/assets/img': 'assets/img/content' } );
	eleventyConfig.setLibrary( 'md', markdownLib );

	// return config
	return {
		dir: {
			input:   'src/content',
			output:  'docs',
			layouts: '_layouts'
		},
		markdownTemplateEngine: 'njk',
		// pathPrefix: '/folder'
	};

};