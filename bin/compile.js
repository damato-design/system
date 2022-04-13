const path = require('path');
const fs = require('fs-extra'); 
const fm = require('front-matter');
const md = require('markdown-it')({
  html: true,
  linkify: true,
  modifyToken: (token) => {
    switch(token.type) {
      case 'strong_open':
        break;
      case 'em_open':
        break;
      case 'code_inline':
        break;
    }
  }
});
const mdCollapsible = require('markdown-it-collapsible');
const mdContainer = require('markdown-it-container');
const mdPrism = require('markdown-it-prism');
const mdModifyToken = require('markdown-it-modify-token');
const minify = require('html-minifier').minify;
const glob = require('glob-fs')({ gitignore: true });
const nunjucks = require('nunjucks');
const slug = require('slug');
const { Savager } = require('savager');
const symbols = require('../root/icons/manifest.json');
const loader = new nunjucks.FileSystemLoader(path.resolve(__dirname, '..', 'templates'));
const env = new nunjucks.Environment(loader, {
  trimBlocks: true,
  lstripBlocks: true,
});
const COMPILED_SITE_PATH = path.resolve(__dirname, '..', '_site');
const DESCRIPTION = `The DAMATO Design System created by Donnie D'Amato is an exploration of architecting a design system without business influence; focusing on the best practices of user experience and web engineering.`;

const savager = new Savager(symbols);
const { sheet, inject } = savager.prepareAssets(Object.keys(symbols), { attemptInject: true });

function audienceContainers(tokens, idx) {
  if (tokens[idx].nesting === 1) {
    const type = tokens[idx].info.trim();

    let value;

    if (type === 'audience-designer') {
      value = 'Designer Info';
    }

    if (type === 'audience-engineer') {
      value = 'Engineer Info';
    }

    return `
      <js-selectsummary type="summary" class="${type}" open>
        <span slot="value">${value}</span>
      `;
  }

  return '</js-selectsummary>'
}

md.use(mdCollapsible)
  .use(mdPrism)
  .use(mdModifyToken)
  .use(mdContainer, 'audience-designer', { render: audienceContainers })
  .use(mdContainer, 'audience-engineer', { render: audienceContainers });

const sitemap = [];

async function compile() {
  const contentFiles = await glob.readdirPromise('content/*.md');
  const componentFiles = await glob.readdirPromise('components/**/*.md');
  const mdFiles = [].concat(contentFiles, componentFiles).filter((file) => path.extname(file) === '.md');
  
  mdFiles.forEach((file) => {
    const contents = fs.readFileSync(file).toString();
    prepareSitemap(path.basename(file, '.md'), fm(contents));
  });

  sitemap.sort(sortOrder).forEach((config) => config.sections = config.sections.sort(sortOrder));
  sitemap.forEach(async (config) => {
    const sections = [config]
      .concat(config.sections)
      .map(renderConfig)
      .join('');
    const html = env.render('base.njk', { 
      sections, 
      sitemap, 
      title: config.page, 
      description: DESCRIPTION,
      sheet, 
      inject: `(${inject.toString()})()`
    });
    const json = JSON.stringify({ content: sections, title: config.page });
    const pageContent = minify(html, { collapseWhitespace: true });
    const pageFileName = `${COMPILED_SITE_PATH}/${config.filename}.html`;
    const pageJsonName = `${COMPILED_SITE_PATH}/json/${config.filename}.json`;
    fs.ensureFileSync(pageFileName);
    fs.writeFileSync(pageFileName, pageContent, { encoding: 'utf8' });

    fs.ensureFileSync(pageJsonName);
    fs.writeFileSync(pageJsonName, json, { encoding: 'utf8' });
  });
  
  const rootUrl = 'https://damato.design/';
  const sitemapFileName = `${COMPILED_SITE_PATH}/sitemap.txt`;
  const urls = sitemap.map(({ filename }) => rootUrl + filename);
  urls.unshift(rootUrl);
  fs.ensureFileSync(sitemapFileName);
  fs.writeFileSync(sitemapFileName, urls.join('\n'), { encoding: 'utf8' });
}

function renderConfig(config) {
  const { markdown, slug, page } = config;
  const id = slug ? `id="${slug}"` : '';
  if (markdown) {
    const html = md.render(markdown).replace(/<pre ?/gmi, '<pre aria-hidden="true" ');
    return `<div ${id} class="content-anchor"><section class="content-section" data-page="${page}">${html}</section></div>`;
  }
  return '';
}

function sortOrder(a, b) {
  return Number(a.order) - Number(b.order);
}

function prepareSitemap(filename, { attributes, body }) {
  if (!attributes.anchor) {
    let existingPage = sitemap.find(({ page }) => page === attributes.page);
    if (existingPage) {
      Object.assign(existingPage, attributes, { filename, markdown: body });
    } else {
      sitemap.push(Object.assign(attributes, { filename, markdown: body, sections: [] }));
    }
  } else {
    attributes.slug = slug(attributes.anchor).toLowerCase();
    let existingPage = sitemap.find(({ page }) => page === attributes.page);
    if (!existingPage) {
      existingPage = { page: attributes.page, sections: [], filename };
      sitemap.push(existingPage);
    }
    existingPage.sections.push(Object.assign(attributes, { markdown: body }));
  }
}

compile();