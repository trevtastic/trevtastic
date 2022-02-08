const env = {
	eleventy: {
		env: {
			config: '<Drive>:/<User>/<SiteDir>/<Root>.eleventy.js',
			root: '<Drive>:/<User>/<SiteDir>/<Root>',
			source: 'cli'
		}
	},
	pkg: {
		name: 'trevtastic',
		version: '1.0.0',
		description: '11ty default profile site',
		scripts: {
			start: 'npx @11ty/eleventy --serve',
			build: 'npx @11ty/eleventy'
		},
		author: 'Trevor Chigonda',
		license: 'ISC',
		devDependencies: {
			'@11ty/eleventy': '^1.0.0',
			'markdown-it': '^12.3.2',
			'markdown-it-attrs': '^4.1.3',
			'markdown-it-replace-link': '^1.1.0'
		},
		dependencies: { react: '^17.0.2' }
	},
	layout: 'base.njk',
	title: 'Linktr',
	page: {
		date: '2022-02-08T04:14:26.676Z',
		inputPath: './src/content/index.md',
		fileSlug: '',
		filePathStem: '/index',
		outputFileExtension: 'html',
		url: '/',
		outputPath: 'docs/index.html'
	},
	collections: { all: [ [Object], [Object], [Object] ] }
}