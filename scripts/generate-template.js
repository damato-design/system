function recurse(target = {}, properties) {
    if (!properties) return '!!null';

    return Object.entries(properties).reduce((acc, [property, value]) => {
        return Object.assign(acc, { [property]: recurse({}, value?.properties) });
    }, target);
}

export default function main(schema) {
    return recurse({}, schema.properties);
}
