import { MetadataManager, MetadataManagerClass } from "./metadata-manager";
import { Constructor } from "../types";
import { getPrototypeChain } from "../util/get-prototype-chain";
import { shake } from "radash";
import { merge } from "../util/merge";



export function InheritableMetadataManagerClass<Metadata extends object, Target extends Constructor>(): Constructor & MetadataManager<Metadata, Target> {
    return class extends MetadataManagerClass<Metadata, Target>() {
      public static getMetadata(target: Target): Metadata {
        const targets = [target, ...getPrototypeChain(target)];
  
        return targets
          .reverse()
          .filter(this.hasMetadata)
          .map(super.getMetadata)
          .reduce(this.mergeMetadatas);
      }
  
      public static mergeMetadatas(a: Metadata, b: Metadata): Metadata {
        return shake(merge(a, b)) as Metadata;
      }
    }
  }