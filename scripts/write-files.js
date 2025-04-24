import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import createSchema from './generate-schema.js';
import createModule from './generate-module.js';
import createCSS from './generate-css.js';

const MODE_PATH = path.join(process.cwd(), 'src', 'modes');
const INTENTS_YAML_PATH = path.join(process.cwd(), 'scripts', 'intents.yml');
const SCHEMA_JSON_PATH = path.join(MODE_PATH, '_schema.json');
const SYSTEM_YAML_PATH = path.join(MODE_PATH, '_system.yml');
const TOKENS_SCSS_PATH = path.join(process.cwd(), 'src', 'components', '_tokens.module.scss');
const MODE_CSS_PATH = path.join(process.cwd(), 'src', 'assets');
const INVENTORY_JSON_PATH = path.join(process.cwd(), 'src', 'assets', '_inventory.json');

const COVERAGE_TYPES = {
    color: (token) => token.endsWith('Color'),
    typography: (token) => token.startsWith('$text'),
    space: (token) => token.startsWith('$space')
}

const _system = yaml.load(fs.readFileSync(SYSTEM_YAML_PATH, 'utf-8'));
const intents = yaml.load(fs.readFileSync(INTENTS_YAML_PATH, 'utf-8'));
const _schema = createSchema(intents);

fs.writeFileSync(SCHEMA_JSON_PATH, JSON.stringify(_schema, null, 2), 'utf-8');
fs.writeFileSync(TOKENS_SCSS_PATH, createModule(intents, _system.tokens), 'utf-8');

function qualifyingYaml(file) {
    const { name, ext } = path.parse(file);
    return !(name.startsWith('_') || !ext.endsWith('yml'))
}

function createCSSFileName(file) {
    const { name } = path.parse(file);
    return `_${name}.css`;
}

function processFile(file) {
    const fullPath = path.join(MODE_PATH, file);
    const yamlContents = yaml.load(fs.readFileSync(fullPath, 'utf8'));
    if (!yamlContents.mode) throw new Error(`Mode is missing for ${file}`);
    const fileName = createCSSFileName(file);
    const css = createCSS(yamlContents, _system.tokens);
    fs.writeFileSync(path.join(MODE_CSS_PATH, fileName), css, 'utf8');
    return createEntry(fileName, yamlContents, css);
}

function createEntry(fileName, data, css) {
    return {
        href: fileName,
        brand: data.brand,
        mode: data.mode,
        lang: data.lang,
        bytes: Buffer.byteLength(css, 'utf8'),
        coverage: getCoverage(data.tokens)
    }
}

const schemaTotals = getTotals(intents);

function getCoverage(tokens) {
    const totals = getTotals(Object.keys(tokens));
    return {
        color: totals.color * 100 / schemaTotals.color,
        typography: totals.typography * 100 / schemaTotals.typography,
        space: totals.space * 100 / schemaTotals.space
    };
}

function getTotals(names) {
    return names.reduce((totals, name) => {
        return {
            color: totals.color + Number(COVERAGE_TYPES.color(name)),
            typography: totals.typography + Number(COVERAGE_TYPES.typography(name)),
            space: totals.space + Number(COVERAGE_TYPES.space(name))
        }
    }, { color: 0, typography: 0, space: 0 });
}

function main() {
    const allYamlFiles = fs.readdirSync(MODE_PATH);
    const inventory = allYamlFiles.filter(qualifyingYaml).map(processFile);
    fs.writeFileSync(INVENTORY_JSON_PATH, JSON.stringify(inventory, null, 2), 'utf8');
}

main();


