const fs = require('fs/promises');
const path = require('path');
const { format } = require('to');
const convert = require('object-to-string-path-array').default;

const THEMES = path.resolve(__dirname, '..', 'src', 'themes');

function transform(json) {
  const { colors, root } = { colors: {}, root: {} };
  convert(JSON.parse(json))
    .map((v) => '--' + v.split('/').slice(0, -1).join('_'))
    .forEach((v) => Object.assign(v.endsWith('color') ? colors : root, { [v]: 'initial' }));
  return format.yaml.stringify(JSON.stringify({
    root,
    light: colors,
    dark: colors,
  }));
};

(async function main() {
  const yml = format.yaml.load(path.join(THEMES, 'schema.yml'));
  const json = format.json.stringify(yml);
  await fs.writeFile(path.join(THEMES, `new.theme.yml`), transform(json), { encoding: 'utf8'});
})();
