import { ClassMetadataDecoratorFn, PropertyMetadataDecoratorFn } from '@garrettmk/metadata-manager';
import { applyActions } from '@garrettmk/metadata-actions';
import { validationActions } from './action-sets/validation-actions';
import { applyPropertyActions } from './class-schema-actions';
import { ClassContext, ClassMetadataManager, PropertiesMetadataManager, PropertyMetadata } from './class-schema-types';
import { Constructor, TypeFn } from './util/types';
import { baseObjectActions } from './action-sets/base-object-actions';

export const ClassMeta = ClassMetadataDecoratorFn(ClassMetadataManager);

export const PropertyMeta = PropertyMetadataDecoratorFn(PropertiesMetadataManager);

export function Property<T>(type: TypeFn<T>, meta?: Omit<PropertyMetadata<T>, 'type'>): PropertyDecorator {
  return PropertyMeta({ type, ...meta });
}


export function Validated(): ClassDecorator {
  return function (target) {
    const metadata = {};
    const context: ClassContext = { target: target as unknown as Constructor };

    applyActions(metadata, context, applyPropertyActions(validationActions));
  }
}

export function BaseObjectType(): ClassDecorator {
  return function (target) {
    const metadata = {};
    const context: ClassContext = { target: target as unknown as Constructor };

    applyActions(metadata, context, applyPropertyActions([
      ...validationActions,
      ...baseObjectActions
    ]));
  }
}