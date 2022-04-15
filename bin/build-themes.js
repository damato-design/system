const fs = require('fs/promises');
const mkdirp = require('mkdirp');
const path = require('path');
const glob = require('fast-glob');
const { format } = require('to');
const { create } = require('jss');
const global = require('jss-plugin-global').default;

const jss = create();
jss.use(global());

const SOURCE = path.resolve(__dirname, '..', 'src');
const THEMES = path.resolve(__dirname, '..', '_site', 'themes');

function styles({ root, standard, inverse }) {
  return {
    ':root': { 
      ...root,
      ...standard
    },
    '@media screen' : { 
      '[data-inverse]': inverse
    },
    '@media screen and (prefers-color-scheme: dark)': { 
      ':root': inverse,
      '[data-inverse]': standard
    }
  };
}

function prepare(filepath) {
  const { name } = path.parse(filepath);
  const yml = format.yaml.load(filepath);
  const json = format.json.stringify(yml);
  const css = jss.createStyleSheet({ '@global': styles(JSON.parse(json)) }).toString();
  return fs.writeFile(path.join(THEMES, `${name}.css`), css, { encoding: 'utf8'});
}

(async function main() {
  const sourcefiles = await glob(path.join(SOURCE, 'themes', '*.theme.yml'));
  await mkdirp(THEMES);
  await Promise.all(sourcefiles.map(prepare));
})();