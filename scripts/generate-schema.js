import { type } from 'os';
import {
    PRIORITY,
    PROPERTY_COLOR,
    PROPERTY_FONT,
    PROPERTY_SPACE
} from './properties.js';

function final(property) {
    const base = {
        type: 'object',
        additionalProperties: false,
        required: ['$value'],
        properties: {
            $value: {
                type: ['number', 'string']
            }
        }
    }

    if (property.includes('Color')) {
        base.properties.$influence = { type: ['number'] }
    }

    if (property.includes('fontFamily')) {
        base.properties.$fallback = { type: ['string'] }
    }

    return base;
}

function permutate(...arrays) {
    const host = {};

    const recurse = (acc, remaining) => {
        const [next, ...rest] = remaining;
        next.forEach((key) => {
            acc[key] = final(key);
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
                    ...permutate(['surface'], PRIORITY, PROPERTY_COLOR),
                    ...permutate(['action'], PRIORITY, PROPERTY_COLOR),
                    ...permutate(['control'], PROPERTY_COLOR),
                    ...permutate(['text'], PRIORITY, PROPERTY_FONT),
                    ...permutate(['space'], PROPERTY_SPACE),
                }
                
            }
        }
    }
}
