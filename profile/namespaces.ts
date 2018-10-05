import { isArray, isString, mapKeys, mapValues } from 'lodash';
import { isObject } from 'util';

export const prefixes = {
    owl: 'http://www.w3.org/2002/07/owl#',
    rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
    xsd: 'http://www.w3.org/2001/XMLSchema#',
    hyper: 'https://hypercontract.org/'
};

export const owl = createUriFactory(prefixes.owl);
export const rdf = createUriFactory(prefixes.rdf);
export const rdfs = createUriFactory(prefixes.rdfs);
export const xsd = createUriFactory(prefixes.xsd);
export const hyper = createUriFactory(prefixes.hyper);

export function createUriFactory(prefix: string) {
    return (name: string | object) => addPrefix(prefix, name);
}

function addPrefix(prefix: string, name: string | object) {
    if (isString(name)) {
        return prefix + name;
    }

    if (isObject(name)) {
        return mapKeysDeep(name, (value, key) => addPrefix(prefix, key));
    }

    throw new Error('Cannot add prefix to given name(s). Invalid object type.');
}

function mapKeysDeep(obj, callback) {
    return mapValues(
        mapKeys(obj, callback),
        value => {
            if (isArray(value)) {
                return value.map(item => mapKeysDeep(item, callback));
            }
            if (isObject(value)) {
                return mapKeysDeep(value, callback);
            }
            return value;
        }
    );
}
