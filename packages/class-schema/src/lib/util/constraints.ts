import { EnumObject as Enum, Values } from "@garrettmk/ts-utils"
import { Id, IdConstructor } from "../custom-types/id"
import { IntConstructor } from "../custom-types/int"
import { FloatConstructor } from "../custom-types/float"


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