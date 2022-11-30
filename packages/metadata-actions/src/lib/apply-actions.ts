import { MaybeArray, Values } from "@garrettmk/ts-utils";
import { MetadataDict } from "dist/packages/metadata-manager";
import { apply, applyToProperties } from "./actions/apply";
import { PropertyContext } from "./metadata-actions";
import { MetadataAction } from "./metadata-selectors";


export function applyActions<Metadata, Context>(metadata: Metadata, context: Context, actions: MaybeArray<MetadataAction<Metadata, Context>>): Metadata {
    return apply(actions)(metadata, context) ?? metadata;
}


export function applyActionsToProperties<Metadata extends MetadataDict, Context>(metadata: Metadata, context: Context, actions: MaybeArray<MetadataAction<Values<Metadata>, Context & PropertyContext>>): Metadata {
    return applyToProperties(actions)(metadata, context) ?? metadata;
}