import { ifMetadata, isSet, MetadataAction } from '@garrettmk/metadata-actions';
import { Constructor } from '@garrettmk/ts-utils';
import { Transform, Type } from 'class-transformer';
import { Equals, IsArray, IsBoolean, IsDate, IsEnum, IsIn, IsInt, IsNotIn, IsNumber, IsOptional, IsString, Matches, Max, MaxDate, MaxLength, Min, MinDate, MinLength, NotEquals } from 'class-validator';
import 'reflect-metadata';
import { decoratePropertyWith } from '../class-schema-actions';
import { innerTypeExtends, innerTypeMatches, isArrayField, isConstructorField, isEnumField, isOptionalField } from '../class-schema-selectors';
import { ClassPropertyContext, PropertyMetadata } from '../class-schema-types';
import { Id, IsId } from '../custom-types/id';
import { Int } from '../custom-types/int';
import { getTypeInfo } from '../util/get-type-info';
import { and, not } from '../util/logical';


export const validationActions: MetadataAction<PropertyMetadata, ClassPropertyContext>[] = [

  //
  // Common
  //

  ifMetadata(
    isOptionalField,
    decoratePropertyWith(() =>
      IsOptional()
    )
  ),

  ifMetadata(isArrayField, decoratePropertyWith(() => IsArray())),

  ifMetadata(
    and(
      isConstructorField,
      not(innerTypeMatches<Constructor>(String, Number, Boolean, Date))
    ),
    [
      decoratePropertyWith((meta) =>
        Type(() => getTypeInfo(meta.type).innerType as Constructor)
      ),
    ]
  ),

  ifMetadata(
    isSet('default'),
    decoratePropertyWith(meta =>
      Transform(value => value ?? meta.default())  
    )
  ),

  //
  // Booleans
  //

  ifMetadata(innerTypeMatches(Boolean), [
    decoratePropertyWith((meta) =>
      IsBoolean({
        each: isArrayField(meta),
      })
    ),

    ifMetadata(isSet('eq'), [
      decoratePropertyWith((meta) =>
        Equals(meta.eq, {
          each: isArrayField(meta),
        })
      ),
    ]),

    ifMetadata(isSet('ne'), [
      decoratePropertyWith((meta) =>
        NotEquals(meta.ne, {
          each: isArrayField(meta),
        })
      ),
    ]),
  ]),

  //
  // Strings
  //

  ifMetadata(innerTypeMatches(String), [
    decoratePropertyWith((meta) =>
      IsString({
        each: isArrayField(meta),
      })
    ),

    ifMetadata(isSet('minLength'), [
      decoratePropertyWith((meta) =>
        MinLength(meta.minLength, {
          each: isArrayField(meta),
        })
      ),
    ]),

    ifMetadata(isSet('maxLength'), [
      decoratePropertyWith((meta) =>
        MaxLength(meta.maxLength, {
          each: isArrayField(meta),
        })
      ),
    ]),

    ifMetadata(isSet('in'), [
      decoratePropertyWith((meta) =>
        IsIn(meta.in, {
          each: isArrayField(meta),
        })
      ),
    ]),

    ifMetadata(isSet('nin'), [
      decoratePropertyWith((meta) =>
        IsNotIn(meta.nin, {
          each: isArrayField(meta),
        })
      ),
    ]),

    ifMetadata(isSet('matches'), [
      decoratePropertyWith((meta) =>
        Matches(meta.matches, {
          each: isArrayField(meta),
        })
      ),
    ]),
  ]),

  //
  // Numbers
  //

  ifMetadata(innerTypeExtends(Number), [
    decoratePropertyWith((meta) => IsNumber({}, {
        each: isArrayField(meta),
      })
    ),

    ifMetadata(isSet('min'), [
      decoratePropertyWith((meta) => Min(meta.min, {
        each: isArrayField(meta),
      })),
    ]),

    ifMetadata(isSet('max'), [
      decoratePropertyWith((meta) => Max(meta.max, {
        each: isArrayField(meta),
      })),
    ]),

    ifMetadata(isSet('eq'), [
      decoratePropertyWith(meta => Equals(meta.eq, {
        each: isArrayField(meta)
      }))
    ]),

    ifMetadata(isSet('ne'), [
      decoratePropertyWith(meta => NotEquals(meta.ne, {
        each: isArrayField(meta)
      }))
    ]),

    ifMetadata(isSet('in'), [
      decoratePropertyWith(meta => IsIn(meta.in, {
        each: isArrayField(meta)
      }))
    ]),

    ifMetadata(isSet('nin'), [
      decoratePropertyWith(meta => IsNotIn(meta.nin, {
        each:  isArrayField(meta)
      }))
    ]),
  ]),

  ifMetadata(innerTypeMatches(Int), [
    decoratePropertyWith(meta => IsInt({
      each: isArrayField(meta)
    }))
  ]),

  //
  // Dates
  //

  ifMetadata(innerTypeMatches(Date), [
    decoratePropertyWith(meta => IsDate({
      each: isArrayField(meta)
    })),

    ifMetadata(isSet('min'), [
      decoratePropertyWith(meta => MinDate(meta.min, {
        each: isArrayField(meta)
      }))
    ]),

    ifMetadata(isSet('max'), [
      decoratePropertyWith(meta => MaxDate(meta.max, {
        each: isArrayField(meta)
      }))
    ]),
  ]),

  //
  // Enums
  //

  ifMetadata(isEnumField, [
    decoratePropertyWith(meta => IsEnum(getTypeInfo(meta.type).innerType, {
      each: isArrayField(meta)
    })),

    ifMetadata(isSet('in'), [
      decoratePropertyWith(meta => IsIn(meta.in, {
        each: isArrayField(meta)
      }))
    ]),

    ifMetadata(isSet('nin'), [
      decoratePropertyWith(meta => IsNotIn(meta.nin, {
        each: isArrayField(meta)
      })),
    ])
  ]),

  //
  // Id
  //

  ifMetadata(innerTypeMatches(Id), [
    decoratePropertyWith(meta => IsId({
      each: isArrayField(meta)
    })),
  ]),



];
