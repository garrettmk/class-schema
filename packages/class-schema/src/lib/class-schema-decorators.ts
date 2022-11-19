import { ClassMetadataDecoratorFn, PropertyMetadataDecoratorFn } from '@garrettmk/metadata-manager';
import { ClassMetadataManager, PropertiesMetadataManager, StringPropertyMetadata } from './class-schema-types';

export const Class = ClassMetadataDecoratorFn(ClassMetadataManager);
export const Property = PropertyMetadataDecoratorFn(PropertiesMetadataManager);


export const String = (meta?: Omit<StringPropertyMetadata, 'type'>) => Property({
  type: () => String,
  ...meta
});

