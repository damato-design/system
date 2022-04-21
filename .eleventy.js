const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addFilter('navigation', function(all) {
    // TODO: allow single level navigation
    return all.reduce((nav, { data, filePathStem, fileSlug }) => {
      if (!data.title) return nav;
      const primary = filePathStem.split('/').filter((dir) => dir && dir !== fileSlug).join(', ');
      if (!nav[primary]) nav[primary] = [];
      nav[primary].push(data);
      return nav;
    }, {});
  });

  eleventyConfig.addPairedShortcode('aside', (children, feedback = 'info') => `<aside data-density-shift role="note" data-feedback="${feedback}">
  
  ${children}
  
  </aside>`);

  eleventyConfig.addPairedShortcode('quote', (children, cite, display) => `<figure class="fig-quote">
  <blockquote cite="${cite}">
  
  ${children}

  </blockquote>
  <figcaption data-density-shift>
  — <a href="${cite}"><cite>${display || cite}</cite></a>
  </figcaption>
  </figure>`);

  eleventyConfig.addPairedShortcode('audience', (children, audience) => `<details data-density-shift role="note" data-audience="${audience}">
  <summary>${audience} Info</summary>
  <div>

  ${children}
  
  </div>
  </details>`);

  eleventyConfig.addPassthroughCopy({"docs/public/*.(css|jpg|png|svg|webmanifest|ico)": '/'});
  return {
    dir: {
      input: 'docs',
      includes: 'templates',
      output: '_site'
    }
  }
};