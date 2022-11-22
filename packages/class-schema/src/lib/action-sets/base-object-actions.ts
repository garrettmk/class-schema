import { ifMetadata, isUnset, MetadataAction, updateMetadata } from '@garrettmk/metadata-actions';
import { innerTypeMatches, isEnumField } from '../class-schema-selectors';
import { PropertyContext, PropertyMetadata } from '../class-schema-types';
import { booleanFieldFaker, dateFieldFaker, enumFieldFaker, idFieldFaker, numberFieldFaker, stringFieldFaker } from '../util/property-fakers';
import { Id } from '../custom-types/id';


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

  ifMetadata(innerTypeMatches(Number), [
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
