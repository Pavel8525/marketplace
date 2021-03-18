const diff = require('object-diff');

export function getDelta(source: any, target: any) {
    const delta = diff(source, target);

    if (Object.keys(delta).length > 0) {
        return delta;
    }

    return null;
}