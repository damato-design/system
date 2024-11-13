import fs from 'fs';
import {
    PRIORITY,
    PROPERTY_COLOR,
    PROPERTY_FONT,
    PROPERTY_SPACE
} from './properties.js';

const schema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    properties: {
        ...permutate(['surface'], PRIORITY, PROPERTY_COLOR),
        ...permutate(['action'], PRIORITY, PROPERTY_COLOR),
        ...permutate(['control'], PROPERTY_COLOR),
        ...permutate(['text'], PRIORITY, PROPERTY_FONT),
        ...permutate(['space'], PROPERTY_SPACE),
    }
}

function final() {
    return {
        type: 'object',
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
                acc[key].properties = {};
                recurse(acc[key].properties, rest);
            }
        });
    }

    recurse(host, arrays);

    return host;
}

fs.writeFileSync('mode-schema.json', JSON.stringify(schema, null, 2), 'utf-8');
