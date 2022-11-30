import { MaybeArray, Values } from "@garrettmk/ts-utils";
import { MetadataDict } from "dist/packages/metadata-manager";
import { apply, applyToProperties } from "./actions";
import { MetadataAction, PropertyContext } from "./types";


/**
 * Applies an action or list of actions to `metadata` and returns the result.
 * 
 * @param metadata The original metadata
 * @param context Context to pass to actions
 * @param actions Actions to apply
 * @returns A new `Metadata` object
 */
export function applyActions<Metadata, Context>(metadata: Metadata, context: Context, actions: MaybeArray<MetadataAction<Metadata, Context>>): Metadata {
    return apply(actions)(metadata, context) ?? metadata;
}

/**
 * Applies an action or list of actions to each property of `metadata` and returns
 * the result.
 * 
 * @param metadata The original metadata
 * @param context Context to pass to the actions
 * @param actions Actions to apply to each property of the `metadata` object
 * @returns A new `Metadata` object
 */
export function applyActionsToProperties<Metadata extends MetadataDict, Context>(metadata: Metadata, context: Context, actions: MaybeArray<MetadataAction<Values<Metadata>, Context & PropertyContext>>): Metadata {
    return applyToProperties(actions)(metadata, context) ?? metadata;
}