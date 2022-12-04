import { MetadataAction } from '@garrettmk/metadata-actions';
import { ensureArray, MaybeArray } from '@garrettmk/ts-utils';
import { ClassContext } from './class-metadata-manager';


export type DecorateClassWithFn<Metadata, Context extends ClassContext> = (
  metadata: Metadata,
  context: Context
) => MaybeArray<ClassDecorator>;

export function decorateClassWith<Metadata, Context extends ClassContext>(
  decoratorsFn: DecorateClassWithFn<Metadata, Context>
): MetadataAction<Metadata, Context> {
  return function (metadata, context) {
    const { target } = context;
    const decorators = ensureArray(decoratorsFn(metadata, context));

    decorators.forEach((decorator) => decorator(target));
  };
}
