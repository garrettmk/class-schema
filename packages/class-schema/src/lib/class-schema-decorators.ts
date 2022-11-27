import { applyActions, applyActionsToProperties } from '@garrettmk/metadata-actions';
import { ClassMetadataDecoratorFn, PropertyMetadataDecoratorFn } from '@garrettmk/metadata-manager';
import { Constructor } from '@garrettmk/ts-utils';
import { baseObjectActions } from './action-sets/base-object-actions';
import { validationActions } from './action-sets/validation-actions';
import { applyActionsToPropertyMetadata } from './class-schema-actions';
import { ClassContext, ClassMetadata, ClassMetadataManager, PropertiesMetadataManager, PropertyMetadata } from './class-schema-types';
import { TypeFn } from './util/types';

export const ClassMeta = ClassMetadataDecoratorFn(ClassMetadataManager);

export const PropertyMeta = PropertyMetadataDecoratorFn(PropertiesMetadataManager);

export function Property<T>(type: TypeFn<T>, meta?: Omit<PropertyMetadata<T>, 'type'>): PropertyDecorator {
  return PropertyMeta({ type, ...meta });
}

export function Class(meta: ClassMetadata = {}): ClassDecorator {
  return function (target) {
    const ctor = target as unknown as Constructor;
    const context: ClassContext = { target: ctor };

    const metadata = applyActions(meta, context, applyActionsToPropertyMetadata([
      ...validationActions,
      ...baseObjectActions
    ]));

    ClassMetadataManager.setMetadata(ctor, metadata);
  }
}


export function Validated(): ClassDecorator {
  return function (target) {
    const ctor = target as unknown as Constructor;
    const metadata = PropertiesMetadataManager.getMetadata(ctor);
    const context: ClassContext = { target: ctor };

    applyActionsToProperties(metadata, context, validationActions);
  }
}
