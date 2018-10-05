import { fromRDF } from 'jsonld';
import { Quad, Writer } from 'n3';
import { compact, Context } from './context';

export function toJsonLd(quads: Quad[], context: Context) {
    return toGraphObjects(quads)
        .then(graphObjects => compact(
            { '@graph': graphObjects },
            context
        ));
}

export function toGraphObjects(quads: Quad[]) {
    return new Promise((resolve, reject) => {
        const writer = new Writer({ format: 'n-quads' });
        writer.addQuads(quads);
        writer.end((error, result) => {
            if (error) {
                return reject(error);
            }

            fromRDF(result, { format: 'application/n-quads' }, (err, doc) => {
                if (err) {
                    return reject(err);
                }

                return resolve(doc);
            });
        });
    });
}
