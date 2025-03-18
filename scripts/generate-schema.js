function typeofValue(intent) {
    const base = { $value: { type: ['number', 'string'] } };

    if (intent.includes('fontFamily')) {
        base.$fallback = { type: ['string'] }
    }

    if (intent.includes('Color')) {
        base.$influence = { type: ['number'] }
    }

    return base;
}

function createTokens(intents) {
    return intents.reduce((acc, intent) => {
        return Object.assign(acc, {
            [intent]: {
                type: 'object',
                additionalProperties: false,
                required: ['$value'],
                properties: typeofValue(intent)
            }
        });
    }, {});
}


export default function main(intents) {
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
                    ...createTokens(intents),
                }
            }
        }
    }
}
