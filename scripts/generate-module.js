import { 
    PRIORITY,
    PROPERTY_COLOR,
    PROPERTY_FONT,
    PROPERTY_SPACE
} from './properties.js';

function permutate(...arrays) {
    const recurse = (arrs, path = []) => {
        if (arrs.length === 0) {
            return [path.join('.')]
        }

        const [first, ...rest] = arrs;
        return first.flatMap((item) => recurse(rest, [...path, item]));
    }
    return recurse(arrays);
}

const surface = permutate(['surface'], PRIORITY, PROPERTY_COLOR);
const action = permutate(['action'], PRIORITY, PROPERTY_COLOR);
const control = permutate(['control'], PROPERTY_COLOR);
const text = permutate(['text'], PRIORITY, PROPERTY_FONT);
const space = permutate(['space'], PROPERTY_SPACE);

console.log({
    surface,
    action,
    control,
    text,
    space
});