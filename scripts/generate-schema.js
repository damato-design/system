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

function permutate(...arrays) {
    const createNestedObject = (keys) =>
        keys.reduceRight((acc, key) => ({
            type: 'object',
            properties: { [key]: acc }
        }), { type: ['string', 'number'] });

    const buildCombinations = (arrays, prefix = []) =>
        arrays[0].flatMap((value) => {
            const newPrefix = [...prefix, value];
            if (arrays.length === 1) {
                // At innermost level, create nested structure
                return [createNestedObject(newPrefix)];
            }
            // Recurse into remaining arrays
            return buildCombinations(arrays.slice(1), newPrefix);
        });

    const mergeResults = (result, nestedObject) => {
        const mergeRecursive = (target, source) => {
            for (const key in source) {
                if (!target[key]) {
                    target[key] = { type: 'object', properties: {} };
                }
                if (source[key].type !== 'object') {
                    target[key] = source[key];
                } else {
                    mergeRecursive(target[key].properties, source[key].properties);
                }
            }
        };

        mergeRecursive(result, nestedObject.properties);
        return result;
    };

    // Start with an empty result object and merge all combinations
    return buildCombinations(arrays).reduce((result, nestedObject) => {
        return mergeResults(result, nestedObject);
    }, {});
}

fs.writeFileSync('mode-schema.json', JSON.stringify(schema, null, 2), 'utf-8');
