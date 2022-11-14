import { MaybeArray } from 'common';


/**
 * Returns a truthy value if a rule's actions should apply to the given metadata.
 */
 export type MetadataSelector<Metadata, Context = unknown> = 
    (meta: Metadata, context: Context) => unknown;

 /**
  * Returns a new metadata value, or undefined if the metadata should not be changed.
  */
 export type MetadataAction<Metadata, Context = unknown> = 
    (meta: Metadata, context: Context) => Metadata | void;

 /**
  * A `RuleSelector` paired one or more `RuleAction`s. If the selector in the `if` key
  * returns `true` for a metadata, the actions under the `then` key will be run. Conversely, 
  * if the selector returns false, the actions under the `else` key will be run.
  * 
  * `then` and `else` can also contain nested rules.
  * 
  * @example ```
  * const rulesForStrings: MetaRule = {
  *     if: isStringMeta(),
  *     then: [
  *         {
  *             if: isEmptyString(),
  *             then: doSomething(),
  *             else: doSomethingElse(),
  *         },
  *         {
  *             ...
  *         }
  *     ]
  * }
  */
 export type MetadataRule<Metadata, Context = unknown> = {
   if: MetadataSelector<Metadata, Context>,
   then: MaybeArray<MetadataAction<Metadata, Context> | MetadataRule<Metadata, Context>>
   else?: MaybeArray<MetadataAction<Metadata, Context> | MetadataRule<Metadata, Context>>
 }
 