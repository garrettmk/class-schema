import { MetadataAction } from '@garrettmk/metadata-actions';
import { MetadataManagerClass, PropertyKey } from '@garrettmk/metadata-manager';
import { BaseModelConstructor } from './base-model';
import { FloatConstructor } from './custom-types/float';
import { Id, IdConstructor } from './custom-types/id';
import { IntConstructor } from './custom-types/int';
import { InnerType, TypeFn } from './util/types';
import { Constructor, Values } from '@garrettmk/ts-utils';

//
// Custom types
//


export type Enum = Record<string, string | number>;

//
// Class metadata
//

export type EntityTypeOptions = true;
export type InputTypeOptions = true;
export type OutputTypeOptions = true;

export type ClassMetadata = {
  description?: string
  input?: InputTypeOptions
  output?: OutputTypeOptions
  entity?: EntityTypeOptions
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

export type IdPropertyMetadata = ScalarPropertyMetadata & {
  primaryKey?: boolean
}

export type ArrayPropertyMetadata = {
  nullableItems?: boolean
}

export type ArrayConstraints = {
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
  eq?: Id
  ne?: Id
  in?: Id[]
  nin?: Id[]
}

export type EnumConstraints<T extends Enum = Enum> = {
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
  T extends BaseModelConstructor ?    CommonPropertyMetadata<T> :
  CommonPropertyMetadata<T, V>;


export type PropertiesMetadata = {
  [key in PropertyKey]: PropertyMetadata
};

export type ClassPropertyContext = ClassContext & {
  propertyKey: PropertyKey
};

export const ClassMetadataManager = MetadataManagerClass<ClassMetadata, Constructor>();

export type ClassMetadataAction = MetadataAction<ClassMetadata, ClassContext>;

export const PropertiesMetadataManager = MetadataManagerClass<PropertiesMetadata, Constructor>();

export type ClassPropertyAction = MetadataAction<PropertyMetadata, ClassPropertyContext>;