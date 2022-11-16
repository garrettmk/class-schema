import { ClassMetadataDecoratorFn, PropertyMetadataDecoratorFn } from "metadata-manager";
import { ClassMetadataManager, PropertiesMetadataManager } from "./class-schema-types";

export const ClassMeta = ClassMetadataDecoratorFn(ClassMetadataManager);
export const PropertyMeta = PropertyMetadataDecoratorFn(PropertiesMetadataManager);
