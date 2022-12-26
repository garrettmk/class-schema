import { InheritedMetadataManagerClass } from '@garrettmk/metadata-manager';
import { Constructor, merge } from '@garrettmk/ts-utils';
import { omit, shake } from 'radash';
import { ClassMetadata } from '../types';

export class ClassMetadataManager extends InheritedMetadataManagerClass<
    ClassMetadata,
    Constructor
>() {
    // Exclude certain keys from being inherited
    protected static excludeFromInheritance: (keyof ClassMetadata)[] = ['abstract'];

    // Implement parent method
    public static merge(
        left: ClassMetadata | undefined,
        right: ClassMetadata | undefined
    ): ClassMetadata {
        return shake(merge(omit(left ?? {}, this.excludeFromInheritance), right));
    }
}
