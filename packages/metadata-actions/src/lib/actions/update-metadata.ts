import { MetadataAction } from "../types";

export type UpdateMetadataFn<Metadata, Context = unknown> = (metadata: Metadata, context: Context) => Partial<Metadata>

/**
 * Merges an update object with the current metadata.
 * 
 * @param updateFn A function that returns a partial `Metadata` object
 * @returns An action that merges the result of `updateFn` with the current metadata
 */
export function updateMetadata<Metadata, Context = unknown>(updateFn: UpdateMetadataFn<Metadata, Context>): MetadataAction<Metadata, Context> {
  return function (metadata, context) {
    const update = updateFn(metadata, context);
    
    return { ...metadata, ...update };
  }
}