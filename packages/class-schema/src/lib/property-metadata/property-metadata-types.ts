import { EnumObject as Enum, Values } from "@garrettmk/ts-utils";
import { BaseModelConstructor } from "../base-model";
import { FloatConstructor } from "../custom-types/float";
import { IdConstructor } from "../custom-types/id";
import { IntConstructor } from "../custom-types/int";
import { Constraints } from "../util/constraints";
import { InnerType, TypeFn } from "../util/types";


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
  T extends Enum[] ?                  CommonPropertyMetadata<T, Values<InnerType<T>>[]>           & ArrayPropertyMetadata     & Constraints<T> :
  T extends IdConstructor ?           CommonPropertyMetadata<IdConstructor, string>               & IdPropertyMetadata        & Constraints<IdConstructor> :
  T extends IdConstructor[] ?         CommonPropertyMetadata<IdConstructor[], string[]>           & ArrayPropertyMetadata     & Constraints<IdConstructor[]> :
  T extends IntConstructor ?          CommonPropertyMetadata<IntConstructor, number>              & ScalarPropertyMetadata    & Constraints<IntConstructor> :
  T extends IntConstructor[] ?        CommonPropertyMetadata<IntConstructor[], number[]>          & ArrayPropertyMetadata     & Constraints<IntConstructor[]> :
  T extends FloatConstructor ?        CommonPropertyMetadata<FloatConstructor, number>            & ScalarPropertyMetadata    & Constraints<FloatConstructor> :
  T extends FloatConstructor[] ?      CommonPropertyMetadata<FloatConstructor[], number[]>        & ArrayPropertyMetadata     & Constraints<FloatConstructor[]> :
  T extends BaseModelConstructor ?    CommonPropertyMetadata<T>                                   & ScalarRelationMetadata :
  T extends BaseModelConstructor[] ?  CommonPropertyMetadata<T>                                   & ArrayRelationMetadata :
  CommonPropertyMetadata<T, V>;

