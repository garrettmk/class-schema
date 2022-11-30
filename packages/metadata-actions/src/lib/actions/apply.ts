import { ensureArray, MaybeArray } from '@garrettmk/ts-utils';
import type { MetadataAction } from '../types';
import { Break } from '../util/break';

/**
 * @param actions An `MetadataAction` or an array of `MetadataActions`
 * @returns A `MetadataAction` that applies the given actions to the metadata
 *          and returns the result.
 */
export function apply<Metadata, Context>(
  actions: MaybeArray<MetadataAction<Metadata, Context>>
): MetadataAction<Metadata, Context> {
  return (metadata, context) => ensureArray(actions).reduce(
    (result, action) => {
      try {
        return action(result, context) ?? result;
      } catch (errorOrBreak) {
        if (errorOrBreak instanceof Break)
          return errorOrBreak.metadata;
        else
          throw errorOrBreak;
      }
    },
    metadata
  ) ?? metadata;
}