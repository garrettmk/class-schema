import { MetadataAction } from '@garrettmk/metadata-actions'
import { MetadataManagerClass, PropertyKey } from '@garrettmk/metadata-manager';
import { random } from 'radash';
import { TypeFn, Constructor, Values, InnerType } from './util/types';

//
// Custom types
//

export class Id extends String {
  static isId(value: unknown): value is Id {
    return typeof value === 'string' && value.length > 0;
  }

  static fake() {
    return random(1, Number.MIN_SAFE_INTEGER) + '';
  }
};

export type Enum = Record<string, string | number>;

//
// Class metadata
//

export enum ObjectType {
  InputType = 'INPUT_TYPE',
  ObjectType = 'OBJECT_TYPE',
  EntityType = 'ENTITY_TYPE',
}

export type ClassMetadata = {
  description?: string
  pluralName?: string
  objectTypes?: ObjectType[]
};

export type ClassContext = {
  target: Constructor
};

//
// Property types
//

export type CommonPropertyMetadata<T = unknown, V = T> = {
    type: TypeFn<T>
    optional?: boolean
    description?: string
    faker?: () => V
    default?: () => V
}


export type ScalarPropertyMetadata = {
    unique?: boolean
}

export type ArrayPropertyMetadata = {
    minItems?: number
    maxItems?: number
}

export type BooleanConstraints = {
  eq?: boolean
  ne?: boolean
}

export type StringConstraints = {
    matches?: RegExp
    minLength?: number
    maxLength?: number
    in?: string[]
    nin?: string[]
}

export type NumberConstraints = {
    min?: number
    max?: number
    eq?: number
    ne?: number
    in?: number[]
    nin?: number[]
}

export type DateConstraints = {
  min?: Date
  max?: Date
}

export type IdConstraints = {
  primaryKey?: boolean
}

export type EnumConstraints<T extends Enum = Enum> = {
  in?: Values<T>[]
  nin?: Values<T>[]
}

export type PropertyMetadata<T = unknown, V = T> =
  T extends StringConstructor ?       CommonPropertyMetadata<StringConstructor, string>           & ScalarPropertyMetadata    & StringConstraints :
  T extends StringConstructor[] ?     CommonPropertyMetadata<StringConstructor[], string[]>       & ArrayPropertyMetadata     & StringConstraints :
  T extends NumberConstructor ?       CommonPropertyMetadata<NumberConstructor, number>           & ScalarPropertyMetadata    & NumberConstraints :
  T extends NumberConstructor[] ?     CommonPropertyMetadata<NumberConstructor[], number[]>       & ArrayPropertyMetadata     & NumberConstraints :
  T extends BooleanConstructor ?      CommonPropertyMetadata<BooleanConstructor, boolean>         & ScalarPropertyMetadata    & BooleanConstraints :
  T extends BooleanConstructor[] ?    CommonPropertyMetadata<BooleanConstructor[], boolean[]>     & ArrayPropertyMetadata     & BooleanConstraints :
  T extends DateConstructor ?         CommonPropertyMetadata<DateConstructor, Date>               & ScalarPropertyMetadata    & DateConstraints :
  T extends DateConstructor[] ?       CommonPropertyMetadata<DateConstructor[], Date[]>           & ArrayPropertyMetadata     & DateConstraints :
  T extends typeof Id ?               CommonPropertyMetadata<typeof Id, string>                   & ScalarPropertyMetadata    & IdConstraints :
  T extends (typeof Id)[] ?           CommonPropertyMetadata<(typeof Id)[], string[]>             & ArrayPropertyMetadata     & IdConstraints :
  T extends Enum ?                    CommonPropertyMetadata<T>                                   & ScalarPropertyMetadata    & EnumConstraints<T> :
  T extends Enum[] ?                  CommonPropertyMetadata<T[]>                                 & ArrayPropertyMetadata     & EnumConstraints<InnerType<T>> :
  CommonPropertyMetadata<T, V>;


export type PropertiesMetadata = {
  [key in PropertyKey]: PropertyMetadata
};

export type PropertyContext = ClassContext & {
  propertyKey: PropertyKey
};

export const ClassMetadataManager = MetadataManagerClass<ClassMetadata, Constructor>();

export type ClassMetadataAction = MetadataAction<ClassMetadata, ClassContext>;

export const PropertiesMetadataManager = MetadataManagerClass<PropertiesMetadata, Constructor>();

export type ClassPropertyAction = MetadataAction<PropertyMetadata, PropertyContext>;