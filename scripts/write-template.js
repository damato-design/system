import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import createTemplate from './generate-template.js';

const MODE_PATH = path.join(process.cwd(), 'src', 'modes');
const SCHEMA_JSON_PATH = path.join(MODE_PATH, '_schema.json');
const NEWMODE_YAML_PATH = path.join(MODE_PATH, 'newmode.yml');
const schema = JSON.parse(fs.readFileSync(SCHEMA_JSON_PATH, 'utf8'));

function format(data) {
    const message = `# yaml-language-server: $schema=./_schema.json`;
    return [message, yaml.dump(data)].join('\n').replaceAll(/\'!!null\'/g, '#value');
}

fs.writeFileSync(NEWMODE_YAML_PATH, format(createTemplate(schema)), 'utf-8');
