import { compact as compactJsonLd } from 'jsonld';
import { defaultTo, omit } from 'lodash';

export type Context = any;

export function addContext(input: any, context: Context) {
    return {
        '@context': context,
        ...input
    };
}

export function compact(input: any, context: Context) {
    return new Promise((resolve, reject) => {
        const inputContext = defaultTo(input['@context'], {});

        compactJsonLd(
            omit(input, ['@context']),
            {
                ...context,
                ...inputContext
            },
            (error: any, output: any) => {
                if (error) {
                    reject(error);
                }

                resolve(output);
            }
        );
    });
}
