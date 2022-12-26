import { EnumObject as Enum, Values } from "@garrettmk/ts-utils"
import { Id, IdConstructor } from "../custom-types/id"
import { Int, IntConstructor } from "../custom-types/int"
import { Float, FloatConstructor } from "../custom-types/float"
import { InnerType } from "./types"


export interface ArrayConstraints {
  minItems?: number
  maxItems?: number
}

export interface BooleanConstraints {
  eq?: boolean
  ne?: boolean
}

export interface StringConstraints {
  eq?: string
  ne?: string
  re?: RegExp
  in?: string[]
  nin?: string[]
  minLength?: number
  maxLength?: number
}

export interface NumberConstraints {
  eq?: number
  ne?: number
  in?: number[]
  nin?: number[]
  min?: number
  max?: number
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
  eq?: Values<T>
  ne?: Values<T>
  in?: Values<T>[]
  nin?: Values<T>[]
}

export type ObjectConstraints<T extends object, K extends keyof T = keyof T> = {
  [k in K]?: Constraints<T[k]>
}


export type Constraints<T> =
  T extends (string | StringConstructor)         ? StringConstraints :
  T extends (string[] | StringConstructor[])     ? StringConstraints & ArrayConstraints :
  T extends (number | NumberConstructor)         ? NumberConstraints :
  T extends (number[] | NumberConstructor[])     ? NumberConstraints & ArrayConstraints :
  T extends (boolean | BooleanConstructor)       ? BooleanConstraints :
  T extends (boolean[] | BooleanConstructor[])   ? BooleanConstraints & ArrayConstraints :
  T extends (Date | DateConstructor)             ? DateConstraints :
  T extends (Date[] | DateConstructor[])         ? DateConstraints & ArrayConstraints :
  T extends Enum                                 ? EnumConstraints<T> :
  T extends Enum[]                               ? EnumConstraints<InnerType<T>> & ArrayConstraints :
  T extends (Id | IdConstructor)                 ? IdConstraints :
  T extends (Id[] | IdConstructor[])             ? IdConstraints & ArrayConstraints :
  T extends (Int | IntConstructor)               ? NumberConstraints :
  T extends (Int[] | IntConstructor[])           ? NumberConstraints & ArrayConstraints :
  T extends (Float | FloatConstructor)           ? NumberConstraints :
  T extends (Float[] | FloatConstructor[])       ? NumberConstraints & ArrayConstraints :
  T extends object                               ? ObjectConstraints<T> :
  T extends object[]                             ? ObjectConstraints<T> & ArrayConstraints :
  never;
