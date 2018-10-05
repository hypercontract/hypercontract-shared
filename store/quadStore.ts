import { DataFactory, Quad } from 'n3';

export class QuadStore {

    constructor(
        private store
    )  {}

    get(uri: string): Quad[] {
        return [
            ...this.getBySubject(uri),
            ...this.getByPredicate(uri),
            ...this.getByObject(uri)
        ];
    }

    getBySubject(uri: string) {
        return this.store.getQuads(DataFactory.namedNode(uri), null, null, null);
    }

    getByPredicate(uri: string) {
        return this.store.getQuads(null, DataFactory.namedNode(uri), null, null);
    }

    getByObject(uri: string) {
        return this.store.getQuads(null, null, DataFactory.namedNode(uri), null);
    }


    getAll(): Quad[] {
        return this.store.getQuads(null, null, null, null);
    }

}


