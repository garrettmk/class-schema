import { ifMetadata, isUnset, MetadataActionSet, updateMetadata } from '@garrettmk/metadata-actions';
import { Constructor } from '@garrettmk/ts-utils';
import { applyActionsToPropertyMetadata } from '../actions/property-metadata-actions';
import { Float } from '../custom-types/float';
import { Id } from '../custom-types/id';
import { Int } from '../custom-types/int';
import { ClassMetadataManager } from '../managers/class-metadata-manager';
import { innerTypeExtends, innerTypeMatches, isEnumField } from '../selectors/property-metadata-selectors';
import { ClassMetadata } from '../types';
import { booleanFieldFaker, dateFieldFaker, enumFieldFaker, floatFieldFaker, idFieldFaker, intFieldFaker, numberFieldFaker, stringFieldFaker } from '../util/property-fakers';

/**
 * Actions for classes descending from BaseObject.
 */
export const BaseObjectActions = new MetadataActionSet<ClassMetadata, Constructor>(ClassMetadataManager, [
  applyActionsToPropertyMetadata([
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
  ])
]);