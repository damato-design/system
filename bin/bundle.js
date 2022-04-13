const path = require('path');
const fs = require('fs-extra');
const glob = require('glob-fs')({ gitignore: true });
const postcss = require('postcss');
const nested = require('postcss-nested');
const mixins = require('postcss-sassy-mixins');

const { rollup } = require('rollup');
const multi = require('@rollup/plugin-multi-entry');
const html = require('rollup-plugin-html');
const postcssPlugin = require('rollup-plugin-postcss');
const JsonPlugin = require('@rollup/plugin-json');
const nodeResolve = require('@rollup/plugin-node-resolve').default;

const SCRIPTS_PATH = path.resolve(__dirname, '..', 'scripts');
const COMPONENT_PATH = path.resolve(__dirname, '..', 'js-components');
const COMPILED_SITE_PATH = path.resolve(__dirname, '..', '_site');
const { BOX_SIZING } = require('../const.json');

async function bundleCSS() {
  const pcssFileOrder = ['fontfaces.pcss', 'vars.pcss', 'index.pcss', 'content.pcss', 'mobile.pcss', 'code.pcss'];
  const pcss = pcssFileOrder.reduce((pcss, pcssFileName) => {
    const filePath = path.resolve(__dirname, '..', 'styles', pcssFileName);
    return pcss + fs.readFileSync(filePath, { encoding: 'utf8'});
  }, '');
  const { css } = await postcss([
    nested(),
    mixins(),
  ]).process(pcss, { from: undefined });
  return css;
}

async function bundleJS() {
  const inputOptions = {
    input: [`${COMPONENT_PATH}/*.js`, `${SCRIPTS_PATH}/*.js`],
    plugins: [
      nodeResolve(),
      multi(),
      html(),
      JsonPlugin(),
      postcssPlugin({ inject: false }),
    ],
  };
  const outputOptions = {
    file: `${COMPILED_SITE_PATH}/components.js`,
    format: 'iife',
    name: 'components',
  };
  const bundle = await rollup(inputOptions);
  const { output } = await bundle.generate(outputOptions);
  return output.reduce((script, { code }) => script + (code || ''), '');
}

function composeStyles(css) {
  return `<style type="text/css"> ${BOX_SIZING} ${css.replace(/\\/g, '\\\\')}</style>`;
}

async function bundle() {
  let siteCss = await bundleCSS();
  let siteJs = await bundleJS();

  const files = await glob.readdirPromise('components/**');
  const blueprints = {};
  files.forEach((file) => {
    const extension = path.extname(file);
    const basename = path.basename(file, extension);
    if (!blueprints[basename]) {
      blueprints[basename] = {};
    }
    blueprints[basename][extension.slice(1)] = fs.readFileSync(file).toString();
  });

  const bluComponents = Object.keys(blueprints).map((blueprint) => {
    const { html, css } = blueprints[blueprint];
    if (css) {
      siteCss += css;
    }

    const cleanName = blueprint.toLowerCase().replace(/-/gm, '');
    const className = `Blu${cleanName}`;
    const tagName = `blu-${cleanName}`;
    console.log(tagName);
    return `class ${className} extends BluComponent {
      constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = \`${composeStyles(css)}${html}\`;
      }
    }
    
    window.customElements.define('${tagName}', ${className});`
  }).join('');

  siteJs += `window.customElements.whenDefined('blu-component').then(() => {
    const BluComponent = window.customElements.get('blu-component');
    ${bluComponents}
  })`;

  const scriptsFileName = `${COMPILED_SITE_PATH}/scripts.js`;
  const stylesCssFileName = `${COMPILED_SITE_PATH}/styles.css`;

  fs.ensureFileSync(scriptsFileName);
  fs.writeFileSync(scriptsFileName, siteJs, { encoding: 'utf8' });

  fs.ensureFileSync(stylesCssFileName);
  fs.writeFileSync(stylesCssFileName, siteCss, { encoding: 'utf8' });
}

bundle();
