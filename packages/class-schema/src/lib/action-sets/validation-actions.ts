import { applyToProperties, ifMetadata, isSet, MetadataActionSet, MetadataSelector, MetadataTypeGuard } from '@garrettmk/metadata-actions';
import { Constructor } from '@garrettmk/ts-utils';
import { Expose, Transform, Type } from 'class-transformer';
import { Equals, IsArray, IsBoolean, IsDate, IsEmail, IsEnum, IsIn, IsInt, IsNotIn, IsNumber, IsOptional, IsString, Matches, Max, MaxDate, MaxLength, Min, MinDate, MinLength, NotEquals } from 'class-validator';
import 'reflect-metadata';
import { ClassMetadata, PropertyMetadata } from '../types';
import { ClassMetadataManager } from '../managers/class-metadata-manager';
import { Id, IsId } from '../custom-types/id';
import { Int } from '../custom-types/int';
import { withPropertiesMetadata } from '../actions/properties-metadata-actions';
import { decoratePropertyWith } from '../actions/property-metadata-actions';
import { innerTypeExtends, innerTypeMatches, isArrayField, isConstructorField, isEnumField, isOptionalField } from '../selectors/property-metadata-selectors';
import { getTypeInfo } from '../util/get-type-info';
import { and, not } from '../util/logical';
import { Enum } from '../util/types';
import { Email } from '../custom-types/email';


export const ValidationActions = new MetadataActionSet<ClassMetadata, Constructor>(ClassMetadataManager, [
  withPropertiesMetadata([
    applyToProperties([
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
    
      ifMetadata(and(innerTypeExtends(String), not(innerTypeMatches(Id))) as MetadataTypeGuard<PropertyMetadata, PropertyMetadata<StringConstructor>>, [
        decoratePropertyWith((meta) =>
          IsString({
            each: isArrayField(meta),
          })
        ),

        ifMetadata(isSet('eq'), [
          decoratePropertyWith(meta => 
            Equals(meta.eq, {
              each: isArrayField(meta)
            })
          )
        ]),

        ifMetadata(isSet('ne'), [
          decoratePropertyWith(meta =>
            NotEquals(meta.ne, {
              each: isArrayField(meta)
            })
          )
        ]),


        ifMetadata(isSet('re'), [
          decoratePropertyWith((meta) =>
            Matches(meta.re, {
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
      ]),

      //
      // Email
      //

      ifMetadata(innerTypeMatches(Email), [
        decoratePropertyWith(meta => IsEmail({}, {
          each: isArrayField(meta)
        }))
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

      //
      // Int
      //

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
        decoratePropertyWith(meta => IsEnum(getTypeInfo<Enum | Enum[]>(meta.type).innerType, {
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
          not(innerTypeMatches<Constructor>(String, Number, Boolean))
        ),
        decoratePropertyWith((meta) =>
          Type(() => getTypeInfo(meta.type).innerType as Constructor)
        ),
      ),

      decoratePropertyWith(() => Expose())
    
      // ifMetadata(
      //   isSet('default'),
      //   decoratePropertyWith(meta =>
      //     Transform(value => value ?? meta.default())  
      //   )
      // ),
    ])
  ])  
]);
