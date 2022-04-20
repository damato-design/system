const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addPassthroughCopy({"docs/public/*.(css|jpg|png|svg|webmanifest|ico)": '/'});
  return {
    dir: {
      input: 'docs',
      includes: 'templates',
      output: '_site'
    }
  }
};