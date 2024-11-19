import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import createSchema from './generate-schema.js';
import createModule from './generate-module.js';
import createCSS from './generate-css.js';

const MODE_PATH = path.join(process.cwd(), 'src', 'modes');
const SCHEMA_JSON_PATH = path.join(MODE_PATH, '_schema.json');
const SYSTEM_YAML_PATH = path.join(MODE_PATH, '_system.yml');
const TOKENS_SCSS_PATH = path.join(process.cwd(), 'src', 'components', '_tokens.module.scss');
const MODE_CSS_PATH = path.join(process.cwd(), 'src', 'assets');
const INVENTORY_JSON_PATH = path.join(process.cwd(), '.storybook', 'public', '_inventory.json');
const _system = yaml.load(fs.readFileSync(SYSTEM_YAML_PATH, 'utf8'));

fs.writeFileSync(SCHEMA_JSON_PATH, JSON.stringify(createSchema(), null, 2), 'utf-8');
fs.writeFileSync(TOKENS_SCSS_PATH, createModule(_system.tokens), 'utf-8');

function qualifyingYaml(file) {
    const { name, ext } = path.parse(file);
    return !(name.startsWith('_') || !ext.endsWith('yml'))
}

function createCSSFileName(file) {
    const { name } = path.parse(file);
    return `_${name}.css`;
}

function processFile(acc, file) {
    const fullPath = path.join(MODE_PATH, file);
    const yamlContents = yaml.load(fs.readFileSync(fullPath, 'utf8'));
    const { alias, lang } = yamlContents;
    if (!alias) throw new Error(`Alias is missing for ${file}`);
    const fileName = createCSSFileName(file);
    fs.writeFileSync(path.join(MODE_CSS_PATH, fileName), createCSS(yamlContents, _system.tokens), 'utf8');
    if (!acc[alias]) acc[alias] = [];
    acc[alias] = lang
        ? acc[alias].concat(fileName)
        : [fileName].concat(acc[alias]);
    return acc;
}

function main() {
    const allYamlFiles = fs.readdirSync(MODE_PATH);
    const inventory = allYamlFiles.filter(qualifyingYaml).reduce(processFile, {});
    fs.writeFileSync(INVENTORY_JSON_PATH, JSON.stringify(inventory, null, 2), 'utf8');
}

main();


