import { InheritedMetadataManagerClass } from "@garrettmk/metadata-manager";
import { Constructor, merge } from "@garrettmk/ts-utils";
import { MetadataAction } from "@garrettmk/metadata-actions";
import { omit, shake } from "radash";


export interface ClassMetadata {
  description?: string
  input?: boolean
  output?: boolean
  entity?: boolean
  abstract?: boolean
  hidden?: boolean
};

export interface ClassContext {
  target: Constructor
};

export type ClassMetadataAction = MetadataAction<ClassMetadata, ClassContext>;


export class ClassMetadataManager extends InheritedMetadataManagerClass<ClassMetadata, Constructor>() {
  protected static excludeFromInheritance: (keyof ClassMetadata)[] = ['abstract'];
  
  public static merge(left: ClassMetadata | undefined, right: ClassMetadata | undefined): ClassMetadata {
    return shake(merge(omit(left ?? {}, this.excludeFromInheritance), right));
  }
}