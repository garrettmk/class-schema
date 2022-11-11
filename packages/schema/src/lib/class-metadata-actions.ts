import { ClassDecorator } from "@/metadata-manager";
import { MetadataAction } from "@/metadata-rules";
import { ensureArray, MaybeArray } from "@/util";
import { ClassTargetContext } from "./class-metadata-types";


export function decorateClass<Metadata, Context extends ClassTargetContext>(...decorators: ClassDecorator[]): MetadataAction<Metadata, Context> {
    return function (metadata, context) {
        const { target } = context;

        decorators.forEach(decorator => decorator(target))
    }
}


export type DecorateClassWithFn<Metadata, Context extends ClassTargetContext> = 
    (metadata: Metadata, context: Context) => MaybeArray<ClassDecorator>;

export function decorateClassWith<Metadata, Context extends ClassTargetContext>(decoratorsFn: DecorateClassWithFn<Metadata, Context>): MetadataAction<Metadata, Context> {
    return function (metadata, context) {
        const { target } = context;
        const decorators = ensureArray(decoratorsFn(metadata, context));

        decorators.forEach(decorator => decorator(target));
    }
}