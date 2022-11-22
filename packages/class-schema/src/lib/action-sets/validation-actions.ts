import { Type } from 'class-transformer';
import { Equals, IsArray, IsBoolean, IsDate, IsEnum, IsIn, IsNotIn, IsNumber, IsOptional, IsString, Matches, Max, MaxDate, MaxLength, Min, MinDate, MinLength, NotEquals } from 'class-validator';
import { Constructor } from '../util/types';
import { isSet, ifMetadata, isUnset, MetadataAction, updateMetadata } from '@garrettmk/metadata-actions';
import { decorateProperty, decoratePropertyWith } from '../class-schema-actions';
import { innerTypeMatches, isArrayField, isConstructorField, isEnumField, isOptionalField } from '../class-schema-selectors';
import { PropertyMetadata, PropertyContext } from '../class-schema-types';
import { getTypeInfo } from '../util/get-type-info';
import { booleanFieldFaker, dateFieldFaker, numberFieldFaker, stringFieldFaker } from '../util/property-fakers';
import { and, not } from '../util/logical';
import { Id, IsId } from '../custom-types/id';

export const validationActions: MetadataAction<PropertyMetadata, PropertyContext>[] = [
  ifMetadata(isOptionalField, decorateProperty(IsOptional())),

  ifMetadata(isArrayField, decorateProperty(IsArray())),

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

    ifMetadata(isUnset('faker'), [
      updateMetadata((meta) => ({
        faker: booleanFieldFaker(meta),
      })),
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

    ifMetadata(isUnset('faker'), [
      updateMetadata((meta) => ({
        faker: stringFieldFaker(meta),
      })),
    ]),
  ]),

  //
  // Numbers
  //

  ifMetadata(innerTypeMatches(Number), [
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

    ifMetadata(isUnset('faker'), [
      updateMetadata(meta => ({
        faker: numberFieldFaker(meta)
      }))
    ])
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

    ifMetadata(isUnset('faker'), [
      updateMetadata(meta => ({
        faker: dateFieldFaker(meta)
      }))
    ])
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

    ifMetadata(isUnset('faker'), [
      updateMetadata(meta => ({
        faker: () => Id.fake()
      }))
    ])
  ])
];
