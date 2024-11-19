export default function main(schema) {
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
    return host;
}
