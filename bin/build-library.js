const fs = require('fs/promises');
const path = require('path');
const glob = require('fast-glob');
const { rollup } = require('rollup');
const html = require('rollup-plugin-html');
const css = require('rollup-plugin-postcss');
const { terser } = require('rollup-plugin-terser');
const sass = require('sass');

const SOURCE = path.resolve(__dirname, '..', 'src');
const SITE = path.resolve(__dirname, '..', '_site');

function prepare(filepath) {
  const tagName = path.basename(path.dirname(filepath))
  return {
    input: filepath,
    plugins: [html(), css({inject: false}), terser()],
    output:  {
      format: 'iife',
      file: path.join(SITE, 'components', `${tagName}.iife.js`),
    },
  };
}

(async function main() {
  const sourcefiles = await glob(path.join(SOURCE, 'components', '**/*.js'));
  const options = sourcefiles.map(prepare);

  const registrar = {
    input: path.join(SOURCE, 'infrastructure', 'registrar.js'),
    plugins: [terser()],
    output: {
      format: 'iife',
      file: path.join(SITE, `registrar.iife.js`),
    }
  }

  options.push(registrar);

  for (const option of options) {
    const bundle = await rollup(option);
    await bundle.write(option.output);
  }

  const { css } = sass.compile(path.join(SOURCE, 'decorations', 'index.scss'));
  fs.writeFile(path.join(SITE, `decorations.css`), css, { encoding: 'utf8'});
})();