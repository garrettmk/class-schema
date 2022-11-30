import { mapMetadataProperties, MetadataDict, MetadataKey } from '@garrettmk/metadata-manager';
import { ensureArray, MaybeArray, Values } from '@garrettmk/ts-utils';
import type { MetadataAction } from './types';
import { MetadataSelector, MetadataTypeGuard, PropertyContext } from './types';


export class Break {}


/**
 * @param actions An `MetadataAction` or an array of `MetadataActions`
 * @returns A `MetadataAction` that applies the given actions to the metadata
 *          and returns the result.
 */
export function apply<Metadata, Context>(
    actions: MaybeArray<MetadataAction<Metadata, Context>>
): MetadataAction<Metadata, Context> {
    return function (metadata, context) {
        let result = metadata;

        for (const action of ensureArray(actions)) {
            try {
                result = action(result, context) ?? result;
            } catch (errorOrBreak) {
                if (errorOrBreak instanceof Break)
                    break;
                else
                    throw errorOrBreak;
            }
        }

        return result;
    }
}


/**
 *
 * @param actions A `MetadataAction` or an array of `MetadataActions`
 * @returns A `MetadataAction` that applies the given actions to each property
 *          in the metadata and returns the result.
 */
export function applyToProperties<Metadata extends MetadataDict, Context>(
    actions: MaybeArray<MetadataAction<Values<Metadata>, Context & PropertyContext>>
): MetadataAction<Metadata, Context> {
    return (metadata: Metadata, context: Context) =>
        mapMetadataProperties(metadata, (propertyMeta, propertyKey) => {
            const propertyContext = { ...context, propertyKey: propertyKey as MetadataKey };
            return apply(actions)(propertyMeta, propertyContext) ?? propertyMeta;
        });
}

/**
 * Signals `apply` or `applyToProperties` to stop applying actions and use
 * the current result.
 *
 * @param metadata
 */
export function breakAction() {
    throw new Break();
}

/**
 * Applies the given actions if the selector/type guard returns true.
 *
 * @param typeGuard
 * @param thenActions
 * @param elseActions
 */
export function ifMetadata<Metadata, Subtype extends Metadata = Metadata, Context = unknown>(
    typeGuard: MetadataTypeGuard<Metadata, Subtype, Context>,
    thenActions: MaybeArray<MetadataAction<Subtype, Context>>,
    elseActions?: MaybeArray<MetadataAction<Metadata, Context>>
): MetadataAction<Metadata, Context>;
export function ifMetadata<Metadata, Context = unknown>(
    selector: MetadataSelector<Metadata, Context>,
    thenActions: MaybeArray<MetadataAction<Metadata, Context>>,
    elseActions?: MaybeArray<MetadataAction<Metadata, Context>>
): MetadataAction<Metadata, Context>;
export function ifMetadata<Metadata, Subtype extends Metadata = Metadata, Context = unknown>(
    selectorOrTypeGuard:
        | MetadataSelector<Metadata, Context>
        | MetadataTypeGuard<Metadata, Subtype, Context>,
    thenActions: MaybeArray<MetadataAction<Subtype, Context>>,
    elseActions?: MaybeArray<MetadataAction<Metadata, Context>>
): MetadataAction<Metadata, Context> {
    return function (metadata, context) {
        if (selectorOrTypeGuard(metadata, context)) return apply(thenActions)(metadata, context);
        else if (elseActions) return apply(elseActions)(metadata, context);

        return metadata;
    };
}

/**
 * Returns an partial `Metadata`
 */
export type UpdateMetadataFn<Metadata, Context = unknown> = (
    metadata: Metadata,
    context: Context
) => Partial<Metadata>;

/**
 * Merges an update object with the current metadata.
 *
 * @param updateFn A function that returns a partial `Metadata` object
 * @returns An action that merges the result of `updateFn` with the current metadata
 */
export function updateMetadata<Metadata, Context = unknown>(
    updateFn: UpdateMetadataFn<Metadata, Context>
): MetadataAction<Metadata, Context> {
    return function (metadata, context) {
        const update = updateFn(metadata, context);

        return { ...metadata, ...update };
    };
}
