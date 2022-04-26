const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

function titleSort(a, b) {
  return a.title.localeCompare(b.title);
}

function orderSort(a, b) {
  return (a.order || Infinity) - (b.order || Infinity);
}

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addFilter('navigation', function(all) {
    // TODO: allow single level navigation
    return all.reduce((nav, { data, filePathStem, fileSlug, url }) => {
      const { title, order } = data;
      if (!title) return nav;
      const path = filePathStem.split('/').filter(Boolean);

      let target = nav;

      if (path.length > 1) {
        const toplevel = path.filter((dir) => dir !== fileSlug).join(', ');
        let existing = nav.find((items) => items.toplevel === toplevel);
        if (!existing) {
          existing = { toplevel, children: [] };
          nav.push(existing);
        }
        target = existing.children;
      } 
      target.push({ title, url, order });
      target.sort(titleSort).sort(orderSort);
      return nav;
    }, []);
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

  eleventyConfig.addPassthroughCopy({"docs/public/*.(css|jpg|png|svg|webmanifest|ico|json)": '/'});
  return {
    dir: {
      input: 'docs',
      includes: 'templates',
      output: '_site'
    }
  }
};