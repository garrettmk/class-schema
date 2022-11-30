
/**
 * Returns a truthy or falsy value for a given metadata/context. Should
 * not have any side-effects.
 */
export type MetadataSelector<Metadata, Context = unknown> = 
    (metadata: Metadata, context: Context) => unknown;

/**
 * Similar to `MetadataSelector`, but asserts type information as well.
 */
export type MetadataTypeGuard<Metadata, Subtype extends Metadata, Context = unknown> = 
    (metadata: Metadata, context: Context) => metadata is Subtype;

/**
 * Execute some action for a given metadata/context. Can modify the metadata
 * by returning a new value.
 */
export type MetadataAction<Metadata, Context = unknown> = 
    (metadata: Metadata, context: Context) => Metadata | void;
