import { PropertyKey } from "@/metadata-manager";
import { MaybeArray } from '@/util';

export type PropertySelector<PropertyMetadata, Context = unknown> = 
    (meta: PropertyMetadata, propertyKey: PropertyKey, context: Context) => unknown;

export type PropertyAction<PropertyMetadata, Context = unknown> = 
    (meta: PropertyMetadata, propertyKey: PropertyKey, context: Context) => PropertyMetadata | void;

export type PropertyRule<PropertyMetadata, Context = unknown> = {
    if: PropertySelector<PropertyMetadata, Context>
    then: MaybeArray<PropertyAction<PropertyMetadata, Context> | PropertyRule<PropertyMetadata, Context>>
    else?: MaybeArray<PropertyAction<PropertyMetadata, Context> | PropertyRule<PropertyMetadata, Context>>
}



