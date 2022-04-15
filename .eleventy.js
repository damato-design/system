module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({"docs/public/*.(css|jpg|png|svg|webmanifest|ico)": '/'});
  return {
    dir: {
      input: 'docs',
      includes: 'templates',
      output: '_site'
    }
  }
};