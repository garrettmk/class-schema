import { MetadataKey } from 'dist/packages/metadata-manager';

/**
 * Returns a truthy or falsy value for a given metadata/context. Should
 * not have any side-effects.
 */
export type MetadataSelector<Metadata, Context = unknown> = (
    metadata: Metadata,
    context: Context
) => unknown;

/**
 * Similar to `MetadataSelector`, but asserts type information as well.
 */
export type MetadataTypeGuard<Metadata, Subtype extends Metadata, Context = unknown> = (
    metadata: Metadata,
    context: Context
) => metadata is Subtype;

/**
 * Execute some action for a given metadata/context. Can modify the metadata
 * by returning a new value.
 */
export type MetadataAction<Metadata, Context = unknown, Output = Metadata> = (
    metadata: Metadata,
    context: Context
) => Output | void;

/**
 * Additional context used by `applyToProperties`
 */
export type PropertyContext = {
    propertyKey: MetadataKey;
};

/**
 * Similar to MetadataAction, but returns a new type
 */
export type MetadataTransform<Metadata, Context, NewType> = (
    metadata: Metadata,
    context: Context
) => NewType
