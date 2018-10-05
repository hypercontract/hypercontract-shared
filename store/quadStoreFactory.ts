import { isUndefined } from 'lodash';
import { N3Store, Store } from 'n3';
import JsonLdParser from 'rdf-parser-jsonld';
import { Readable } from 'stream';
import { QuadStore } from './quadStore';

const stores = new Map<string, QuadStore>();

export function createOrGetStore(name: string, jsonLdData?: any) {
    if (stores.has(name)) {
        return Promise.resolve(stores.get(name)!);
    }

    return createQuadStore(jsonLdData)
        .then((store: QuadStore) => {
            stores.set(name, store);
            return store;
        });
}

function createQuadStore(jsonLdData?: any) {
    return createStore(jsonLdData)
        .then(store => new QuadStore(store));
}

function createStore(jsonLdData?: any) {
    const store = new Store();

    if (isUndefined(jsonLdData)) {
        return Promise.resolve(store);
    }

    return loadDataIntoStore(store, jsonLdData)
        .then(() => store);
}

function loadDataIntoStore(store: N3Store, jsonLdData: any) {
    return new Promise((resolve, reject) => {
        const parser = new JsonLdParser();
        const jsonLdStream = parser.import(objectToStream(jsonLdData));

        store.import(jsonLdStream)
            .on('error', error => reject(error))
            .on('end', () => resolve());
    });
}

function objectToStream(obj: any) {
    const readable = new Readable({
        objectMode: true,
        read: () => {
            readable.push(JSON.stringify(obj));
            readable.push(null);
        }
    });
    return readable;
}
