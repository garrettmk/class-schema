import { InheritedMetadataManagerClass, MetadataKey } from "@garrettmk/metadata-manager";
import { Constructor, merge } from "@garrettmk/ts-utils";
import { MetadataAction, TargetContext } from "@garrettmk/metadata-actions";
import { omit, shake } from "radash";
import { ClassContext } from "../class-metadata/class-metadata-manager";
import { PropertyMetadata } from "../property-metadata/property-metadata-types";


export type PropertiesMetadata = {
  [key in PropertyKey]: PropertyMetadata
};

export type PropertiesContext = TargetContext<Constructor>;

export type PropertiesMetadataAction = MetadataAction<PropertiesMetadata, ClassContext>;

export class PropertiesMetadataManager extends InheritedMetadataManagerClass<PropertiesMetadata, Constructor>() {
    protected static excludeFromInheritance: MetadataKey[] = ['abstract'];

    public static merge(left: PropertiesMetadata | undefined, right: PropertiesMetadata | undefined): PropertiesMetadata {
        return shake(merge(omit(left ?? {}, this.excludeFromInheritance), right));
    }
}