import { ClassMetadataDecoratorFn, PropertyMetadataDecoratorFn } from '@garrettmk/metadata-manager';
import { applyActions } from '@garrettmk/metadata-actions';
import { validationActions } from './action-sets/validation-actions';
import { applyPropertyActions } from './class-schema-actions';
import { ClassContext, ClassMetadataManager, PropertiesMetadataManager } from './class-schema-types';
import { Constructor } from './util/types';

export const ClassMeta = ClassMetadataDecoratorFn(ClassMetadataManager);

export const PropertyMeta = PropertyMetadataDecoratorFn(PropertiesMetadataManager);

export function Validated(): ClassDecorator {
  return function (target) {
    const metadata = {};
    const context: ClassContext = { target: target as unknown as Constructor };

    applyActions(metadata, context, applyPropertyActions(validationActions));
  }
}