import { InheritedMetadataManagerClass, MetadataKey } from "@garrettmk/metadata-manager";
import { Constructor, merge } from "@garrettmk/ts-utils";
import { omit, shake } from "radash";
import { PropertiesMetadata } from "../types";


export class PropertiesMetadataManager extends InheritedMetadataManagerClass<PropertiesMetadata, Constructor>() {
    protected static excludeFromInheritance: MetadataKey[] = ['abstract'];

    public static merge(left: PropertiesMetadata | undefined, right: PropertiesMetadata | undefined): PropertiesMetadata {
        return shake(merge(omit(left ?? {}, this.excludeFromInheritance), right));
    }
}