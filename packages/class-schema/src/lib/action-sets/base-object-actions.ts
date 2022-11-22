import { ifMetadata, isUnset, MetadataAction, updateMetadata } from '@garrettmk/metadata-actions';
import { innerTypeExtends, innerTypeMatches, isEnumField } from '../class-schema-selectors';
import { PropertyContext, PropertyMetadata } from '../class-schema-types';
import { booleanFieldFaker, dateFieldFaker, enumFieldFaker, floatFieldFaker, idFieldFaker, intFieldFaker, numberFieldFaker, stringFieldFaker } from '../util/property-fakers';
import { Id } from '../custom-types/id';
import { Int } from '../custom-types/int';
import { Float } from '../custom-types/float';


export const baseObjectActions: MetadataAction<PropertyMetadata, PropertyContext>[] = [
  
  //
  // Booleans
  //

  ifMetadata(innerTypeMatches(Boolean), [
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
    ifMetadata(isUnset('faker'), [
      updateMetadata((meta) => ({
        faker: stringFieldFaker(meta),
      })),
    ]),
  ]),

  //
  // Numbers
  //

  ifMetadata(innerTypeExtends(Number), [
    ifMetadata(isUnset('faker'), [
      updateMetadata(meta => ({
        faker: numberFieldFaker(meta)
      }))
    ])
  ]),


  //
  // Ints
  //

  ifMetadata(innerTypeMatches(Int), [
    ifMetadata(isUnset('faker'), [
      updateMetadata(meta => ({
        faker: intFieldFaker(meta)
      }))
    ])
  ]),


  //
  // Floats
  //

  ifMetadata(innerTypeMatches(Float), [
    ifMetadata(isUnset('faker'), [
      updateMetadata(meta => ({
        faker: floatFieldFaker(meta)
      }))
    ])
  ]),

  //
  // Dates
  //

  ifMetadata(innerTypeMatches(Date), [
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
    ifMetadata(isUnset('faker'), [
      updateMetadata(meta => ({
        faker: enumFieldFaker(meta)
      }))
    ])
  ]),

  //
  // Id
  //

  ifMetadata(innerTypeMatches(Id), [
    ifMetadata(isUnset('faker'), [
      updateMetadata(meta => ({
        faker: idFieldFaker(meta)
      }))
    ])
  ])
];
