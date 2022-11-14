import { ensureArray, MaybeArray } from "util";


export type MetadataAction<Metadata, Context = unknown> =
    (metadata: Metadata, context: Context) => Metadata | void;


export function applyActions<Metadata, Context = unknown>(metadata: Metadata, context: Context, actions: MaybeArray<MetadataAction<Metadata, Context>>): Metadata {
    return ensureArray(actions).reduce(
        (result, action) => action(result, context) ?? result,
        metadata
    ) ?? metadata;
}

