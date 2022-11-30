import { MetadataAction } from '@garrettmk/metadata-actions';
import { MetadataDict, MetadataManagerClass, PropertyKey } from '@garrettmk/metadata-manager';
import { Constructor, Values } from '@garrettmk/ts-utils';
import { BaseModelConstructor } from './base-model';
import { FloatConstructor } from './custom-types/float';
import { Id, IdConstructor } from './custom-types/id';
import { IntConstructor } from './custom-types/int';
import { TypeFn } from './util/types';

//
// Custom types
//


export type Enum = Record<string, string | number>;

//
// Class metadata
//


export interface ClassMetadata extends MetadataDict {
  description?: string
  input?: boolean
  output?: boolean
  entity?: boolean
  abstract?: boolean
  hidden?: boolean
};

export interface ClassContext {
  target: Constructor
};

//
// Property types
//

export interface CommonPropertyMetadata<T = unknown, V = T> {
    type: TypeFn<T>
    optional?: boolean
    description?: string
    faker?: () => V
    default?: () => V
    hidden?: boolean
}


export interface ScalarPropertyMetadata {
    unique?: boolean
}

export interface IdPropertyMetadata extends ScalarPropertyMetadata {
  primaryKey?: boolean
}

export interface ArrayPropertyMetadata {
  nullableItems?: boolean
}

export interface ScalarRelationMetadata {
  oneToOne?: boolean
  manyToOne?: boolean
}

export interface ArrayRelationMetadata {
  oneToMany?: boolean
  manyToMany?: boolean
}

export interface ArrayConstraints {
    minItems?: number
    maxItems?: number
}

export interface BooleanConstraints {
  eq?: boolean
  ne?: boolean
}

export interface StringConstraints {
    matches?: RegExp
    minLength?: number
    maxLength?: number
    in?: string[]
    nin?: string[]
}

export interface NumberConstraints {
    min?: number
    max?: number
    eq?: number
    ne?: number
    in?: number[]
    nin?: number[]
}

export interface DateConstraints {
  min?: Date
  max?: Date
}

export interface IdConstraints {
  eq?: Id
  ne?: Id
  in?: Id[]
  nin?: Id[]
}

export interface EnumConstraints<T extends Enum = Enum> {
  in?: Values<T>[]
  nin?: Values<T>[]
}

export type ObjectConstraints<T extends object, Keys extends keyof T = keyof T> = {
  [k in Keys]?: Constraints<T[k]>
}


export type Constraints<T> =
  T extends StringConstructor       ? StringConstraints :
  T extends StringConstructor[]     ? StringConstraints & ArrayConstraints :
  T extends NumberConstructor       ? NumberConstraints :
  T extends NumberConstructor[]     ? NumberConstraints & ArrayConstraints :
  T extends BooleanConstructor      ? BooleanConstraints :
  T extends BooleanConstructor[]    ? BooleanConstraints & ArrayConstraints :
  T extends DateConstructor         ? DateConstraints :
  T extends DateConstructor[]       ? DateConstraints & ArrayConstraints :
  T extends Enum                    ? EnumConstraints<Enum> :
  T extends Enum[]                  ? EnumConstraints<Enum> & ArrayConstraints :
  T extends IdConstructor           ? IdConstraints :
  T extends IdConstructor[]         ? IdConstraints & ArrayConstraints :
  T extends IntConstructor          ? NumberConstraints :
  T extends IntConstructor[]        ? NumberConstraints & ArrayConstraints :
  T extends FloatConstructor        ? NumberConstraints :
  T extends FloatConstructor[]      ? NumberConstraints & ArrayConstraints :
  T extends object                  ? ObjectConstraints<T> :
  never;

export type PropertyMetadata<T = unknown, V = T> =
  T extends StringConstructor ?       CommonPropertyMetadata<StringConstructor, string>           & ScalarPropertyMetadata    & Constraints<StringConstructor> :
  T extends StringConstructor[] ?     CommonPropertyMetadata<StringConstructor[], string[]>       & ArrayPropertyMetadata     & Constraints<StringConstructor[]> :
  T extends NumberConstructor ?       CommonPropertyMetadata<NumberConstructor, number>           & ScalarPropertyMetadata    & Constraints<NumberConstructor> :
  T extends NumberConstructor[] ?     CommonPropertyMetadata<NumberConstructor[], number[]>       & ArrayPropertyMetadata     & Constraints<NumberConstructor[]> :
  T extends BooleanConstructor ?      CommonPropertyMetadata<BooleanConstructor, boolean>         & ScalarPropertyMetadata    & Constraints<BooleanConstructor> :
  T extends BooleanConstructor[] ?    CommonPropertyMetadata<BooleanConstructor[], boolean[]>     & ArrayPropertyMetadata     & Constraints<BooleanConstructor[]> :
  T extends DateConstructor ?         CommonPropertyMetadata<DateConstructor, Date>               & ScalarPropertyMetadata    & Constraints<DateConstructor> :
  T extends DateConstructor[] ?       CommonPropertyMetadata<DateConstructor[], Date[]>           & ArrayPropertyMetadata     & Constraints<DateConstructor[]> :
  T extends Enum ?                    CommonPropertyMetadata<T, Values<T>>                        & ScalarPropertyMetadata    & Constraints<T> :
  T extends Enum[] ?                  CommonPropertyMetadata<T[], Values<T>[]>                    & ArrayPropertyMetadata     & Constraints<T> :
  T extends IdConstructor ?           CommonPropertyMetadata<IdConstructor, string>               & IdPropertyMetadata        & Constraints<IdConstructor> :
  T extends IdConstructor[] ?         CommonPropertyMetadata<IdConstructor[], string[]>           & ArrayPropertyMetadata     & Constraints<IdConstructor[]> :
  T extends IntConstructor ?          CommonPropertyMetadata<IntConstructor, number>              & ScalarPropertyMetadata    & Constraints<IntConstructor> :
  T extends IntConstructor[] ?        CommonPropertyMetadata<IntConstructor[], number[]>          & ArrayPropertyMetadata     & Constraints<IntConstructor[]> :
  T extends FloatConstructor ?        CommonPropertyMetadata<FloatConstructor, number>            & ScalarPropertyMetadata    & Constraints<FloatConstructor> :
  T extends FloatConstructor[] ?      CommonPropertyMetadata<FloatConstructor[], number[]>        & ArrayPropertyMetadata     & Constraints<FloatConstructor[]> :
  T extends BaseModelConstructor ?    CommonPropertyMetadata<T>                                   & ScalarRelationMetadata :
  T extends BaseModelConstructor[] ?  CommonPropertyMetadata<T>                                   & ArrayRelationMetadata :
  CommonPropertyMetadata<T, V>;


export type PropertiesMetadata = {
  [key in PropertyKey]: PropertyMetadata
};

export type ClassPropertiesContext = ClassContext;

export interface ClassPropertyContext extends ClassPropertiesContext {
  propertyKey: PropertyKey
};

export const ClassMetadataManager = MetadataManagerClass<ClassMetadata, Constructor>();

export const PropertiesMetadataManager = MetadataManagerClass<PropertiesMetadata, Constructor>();

export type ClassMetadataAction = MetadataAction<ClassMetadata, ClassContext>;

export type PropertiesMetadataAction = MetadataAction<PropertiesMetadata, ClassPropertiesContext>;

export type PropertyMetadataAction = MetadataAction<PropertyMetadata, ClassPropertyContext>;