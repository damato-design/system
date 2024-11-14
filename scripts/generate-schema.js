import fs from 'fs';
import path from 'path';

import {
    PRIORITY,
    PROPERTY_COLOR,
    PROPERTY_FONT,
    PROPERTY_SPACE
} from './properties.js';

const SCHEMA_JSON_PATH = path.join(process.cwd(), 'src', 'modes', '_schema.json');

const schema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    required: ['alias','tokens'],
    properties: {
        alias: {
            type: 'string'
        },
        symbolic: {
            type: 'boolean'
        },
        lang: {
            type: 'string'
        },
        tokens: {
            type: 'object',
            required: ['surface', 'action', 'control', 'text', 'space'],
            properties: {
                ...permutate(['surface'], PRIORITY, PROPERTY_COLOR),
                ...permutate(['action'], PRIORITY, PROPERTY_COLOR),
                ...permutate(['control'], PROPERTY_COLOR),
                ...permutate(['text'], PRIORITY, PROPERTY_FONT),
                ...permutate(['space'], PROPERTY_SPACE),
            }
            
        }
    }
}

function final() {
    return {
        type: 'object',
        additionalProperties: false,
        required: ['$value'],
        properties: {
            $value: {
                type: ['number', 'string']
            },
            $influence: {
                type: ['number']
            }
        }
    }
}

function permutate(...arrays) {
    const host = {};

    const recurse = (acc, remaining) => {
        const [next, ...rest] = remaining;
        next.forEach((key) => {
            acc[key] = final();
            if (rest.length) {
                acc[key].type = 'object';
                acc[key].additionalProperties = false;
                if (rest[0]) {
                    acc[key].required = rest[0];
                }
                acc[key].properties = {};
                recurse(acc[key].properties, rest);
            }
        });
    }

    recurse(host, arrays);

    return host;
}

fs.writeFileSync(SCHEMA_JSON_PATH, JSON.stringify(schema, null, 2), 'utf-8');
