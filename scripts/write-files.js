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
const INVENTORY_JSON_PATH = path.join(process.cwd(), 'src', 'assets', '_inventory.json');

const COVERAGE_TYPES = {
    color: (name) => name.endsWith('Color'),
    typography: (name) => name.startsWith('text'),
    space: (name) => name.startsWith('space')
}

const _system = yaml.load(fs.readFileSync(SYSTEM_YAML_PATH, 'utf-8'));
const _schema = createSchema();
const schemaNames = getSchemaNames(_schema.properties.tokens.properties);
const schemaTotals = getTotals(schemaNames);

fs.writeFileSync(SCHEMA_JSON_PATH, JSON.stringify(_schema, null, 2), 'utf-8');
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
    const alias = yamlContents.alias;
    if (!alias) throw new Error(`Alias is missing for ${file}`);
    const fileName = createCSSFileName(file);
    fs.writeFileSync(path.join(MODE_CSS_PATH, fileName), createCSS(yamlContents, _system.tokens), 'utf8');
    const entry = createEntry(fileName, yamlContents);
    if (!acc[alias]) acc[alias] = [];
    acc[alias] = entry.symbolic
        ? acc[alias].concat(entry)
        : [entry].concat(acc[alias]);
    return acc;
}

function createEntry(fileName, data) {
    return {
        href: fileName,
        symbolic: data.symbolic,
        lang: data.lang,
        coverage: getCoverage(data.tokens)
    }
}

function getSchemaNames(obj, path = '') {
    return Object.entries(obj).reduce((names, [key, value]) => {
        const update = [path, key].filter(Boolean).join('_');
        const { properties, type } = value;
        if (type !== 'object') return path;
        return typeof properties === 'object' && properties !== null
            ? names.concat(getSchemaNames(properties, update))
            : names.concat(update);
    }, []);
}

function getModeNames(obj, path = '') {
    return Object.entries(obj).reduce((names, [key, value]) => {
        const update = [path, key].filter(Boolean).join('_');
        if (key.startsWith('$')) return path;
        return typeof value === 'object' && value !== null
            ? names.concat(getModeNames(value, update))
            : names.concat(update);
    }, []);
}

function getCoverage(tokens) {
    const modeNames = getModeNames(tokens);
    const modeTotals = getTotals(modeNames);
    return {
        color: modeTotals.color * 100 / schemaTotals.color,
        typography: modeTotals.typography * 100 / schemaTotals.typography,
        space: modeTotals.space * 100 / schemaTotals.space
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
    const inventory = allYamlFiles.filter(qualifyingYaml).reduce(processFile, {});
    fs.writeFileSync(INVENTORY_JSON_PATH, JSON.stringify(inventory, null, 2), 'utf8');
}

main();


