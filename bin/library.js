const path = require('path');
const glob = require('fast-glob');
const { rollup } = require('rollup');
const html = require('rollup-plugin-html');
const css = require('rollup-plugin-postcss');
const { terser } = require('rollup-plugin-terser');

const SOURCE = path.resolve(__dirname, '..', 'src');

function prepare(filepath) {
  const tagName = path.basename(path.dirname(filepath))
  return {
    input: filepath,
    plugins: [html(), css({inject: false}), terser()],
    output:  {
      format: 'iife',
      file: path.join('_site', 'components', `${tagName}.iife.js`),
      globals: tagName,
    },
  };
}

(async function main() {
  const sourcefiles = await glob(path.join(SOURCE, 'components', '**/*.js'));
  const options = sourcefiles.map(prepare);
  const tagNames = options.map(({ output }) => output.globals);

  const registrar = {
    input: path.join(SOURCE, 'infrastructure', 'registrar.js'),
    plugins: [terser()],
    output: {
      format: 'iife',
      file: path.join('_site', `registrar.iife.js`),
      banner: `const components = [${tagNames.map((t) => `'${t}'`).join(',')}];`
    }
  }

  options.push(registrar);

  for (const option of options) {
    const bundle = await rollup(option);
    await bundle.write(option.output);
  }
})();