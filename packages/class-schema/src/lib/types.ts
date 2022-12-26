import { TargetContext, MetadataAction } from "@garrettmk/metadata-actions";
import { Constructor } from "@garrettmk/ts-utils";
import { EnumObject as Enum, Values } from "@garrettmk/ts-utils";
import { BaseModelConstructor } from "./base-model";
import { EmailConstructor } from "./custom-types/email";
import { FloatConstructor } from "./custom-types/float";
import { IdConstructor } from "./custom-types/id";
import { IntConstructor } from "./custom-types/int";
import { Constraints } from "./util/constraints";
import { InnerType, TypeFn } from "./util/types";

//
// Classes
//

/**
 * Metadata stored for a class. Properties metadata is stored in
 * another manager.
 */
export interface ClassMetadata {
    description?: string;
    input?: boolean;
    output?: boolean;
    entity?: boolean;
    abstract?: boolean;
    hidden?: boolean;
}

/**
 * Context for actions working on classes/class metadata
 */
export type ClassContext = TargetContext<Constructor>;

/**
 * A shorthand type for actions working on classes and their metadata.
 */
export type ClassMetadataAction = MetadataAction<ClassMetadata, ClassContext>;

//
// Class properties
//

/**
 * A dictionary of property names to property metadata
 */
export type PropertiesMetadata = {
    [key in PropertyKey]: PropertyMetadata
};

/**
 * Context for actions working on class properties metadata
 */
export type PropertiesContext = TargetContext<Constructor>;

/**
 * A shorthand type for actions that work on classes and their properties metadata
 */
export type PropertiesMetadataAction = MetadataAction<PropertiesMetadata, ClassContext>;

//
// Individual properties
//

/**
 * Metadata used on all properties
 */
export interface CommonPropertyMetadata<T = unknown, V = T> {
    type: TypeFn<T>
    optional?: boolean
    description?: string
    faker?: () => V
    default?: () => V
    hidden?: boolean
}

/**
 * Metadata for singular values
 */
export interface ScalarPropertyMetadata {
    unique?: boolean
}

/**
 * Metadata for scalar ID fields
 */
export interface IdPropertyMetadata extends ScalarPropertyMetadata {
    primaryKey?: boolean
}

/**
 * Metadata for array/collection properties
 */
export interface ArrayPropertyMetadata {
    nullableItems?: boolean
}

/**
 * Metadata for singular relations
 */
export interface ScalarRelationMetadata {
    oneToOne?: boolean
    manyToOne?: boolean
}

/**
 * Metadata for collection relations
 */
export interface ArrayRelationMetadata {
    oneToMany?: boolean
    manyToMany?: boolean
}

/**
 * Combined property metadata for a given type
 */
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
    T extends EmailConstructor ?        CommonPropertyMetadata<StringConstructor, string>           & ScalarPropertyMetadata    & Constraints<StringConstructor> :
    T extends EmailConstructor[] ?      CommonPropertyMetadata<StringConstructor[], string[]>       & ArrayPropertyMetadata     & Constraints<StringConstructor[]> :
    T extends BaseModelConstructor ?    CommonPropertyMetadata<T>                                   & ScalarRelationMetadata :
    T extends BaseModelConstructor[] ?  CommonPropertyMetadata<T>                                   & ArrayRelationMetadata :
    CommonPropertyMetadata<T, V>;