import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const SCHEMA_JSON_PATH = path.join(process.cwd(), 'src', 'modes', '_schema.json');
const NEWMODE_YAML_PATH = path.join(process.cwd(), 'src', 'modes', 'newmode.yml');
const schema = JSON.parse(fs.readFileSync(SCHEMA_JSON_PATH, 'utf-8'));

function template() {
    const host = {};
    const recurse = (target, properties) => {
        if (!properties) return;
        if ('$value' in properties) {
            target.$value = '!!null'
            return;
        }
        Object.entries(properties).forEach(([prop, value]) => {
            target[prop] = {}
            recurse(target[prop], value.properties);
        });
    }
    recurse(host, schema.properties);
    const message = `# yaml-language-server: $schema=./_schema.json`;
    return [message, yaml.dump(host)].join('\n').replaceAll(/\'!!null\'/g, '#value');
}

fs.writeFileSync(NEWMODE_YAML_PATH, template(), 'utf-8');
