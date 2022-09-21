const htmlmin = require('html-minifier');

module.exports = function (config) {
    config.addPassthroughCopy({
        'src/favicon/favicon.ico': 'favicon.ico',
        'src/favicon/favicon.svg': 'favicon.svg',
    });
    config.addPassthroughCopy('src/manifest.webmanifest');
    config.addPassthroughCopy('src/style.css');
    config.addPassthroughCopy('src/script.js');
    config.addPassthroughCopy(
        'src/**/*.(html|jpg|png|webp|avif|ico|svg|mp4|xml)',
    );

    config.addTransform('htmlmin', function (content, outputPath) {
        // Eleventy 1.0+: use this.inputPath and this.outputPath instead
        if (outputPath && outputPath.endsWith('.html')) {
            let minified = htmlmin.minify(content, {
                useShortDoctype: true,
                removeComments: true,
                collapseWhitespace: true,
            });
            return minified;
        }

        return content;
    });

    return {
        dir: {
            input: 'src',
            output: 'docs',
            data: 'data',
        },
        dataTemplateEngine: 'njk',
        markdownTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',
        passthroughFileCopy: true,
        templateFormats: ['md', 'njk'],
    };
};
