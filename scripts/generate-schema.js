import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const INTENTS_YAML_PATH = path.join(process.cwd(), 'scripts', 'intents.yml');
const intents = yaml.load(fs.readFileSync(INTENTS_YAML_PATH, 'utf-8'));

function typeofValue(key) {
    const base = { $value: { type: ['number', 'string'] } };

    if (key.includes('fontFamily')) {
        base.$fallback = { type: ['string'] }
    }

    if (key.includes('Color')) {
        base.$influence = { type: ['number'] }
    }

    return base;
}

function createTokens() {
    return intents.reduce((acc, path) => {
        return path.split('.').reduce((property, key, index, keys) => {
    
            // If key on property doesn't exist, create it
            if (!property[key]) {
                Object.assign(property, { [key]: {
                    type: 'object',
                    additionalProperties: false,
                    required: [],
                    properties: {}
                } });
            }
    
            // Add the following key as required
            const required = keys[index + 1] || '$value';
            if (!property[key].required.includes(required)) {
                property[key].required.push(required);
            }
    
            // If we're at the end, set the $value schema and return collection
            if (path.endsWith(key)) {
                Object.assign(property[key].properties, typeofValue(key));
                return acc;
            }
    
            // If not at the end, continue looping
            return property[key].properties;
        }, acc);
    }, {});
}


export default function main() {
    return {
        $schema: 'http://json-schema.org/draft-07/schema#',
        type: 'object',
        required: ['mode', 'tokens'],
        properties: {
            mode: {
                type: 'string'
            },
            brand: {
                type: 'string'
            },
            lang: {
                type: 'string'
            },
            tokens: {
                type: 'object',
                properties: {
                    ...createTokens(),
                }
            }
        }
    }
}
