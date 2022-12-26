import { Constructor, getPrototypeChain, merge } from "@garrettmk/ts-utils";
import { shake } from "radash";
import { MetadataManager, MetadataManagerClass } from "./metadata-manager";

export interface InheritedMetadataManager<Metadata, Target = unknown> extends MetadataManager<Metadata, Target> {
    hasOwnMetadata(target: Target): boolean
    getOwnMetadata(target: Target): Metadata
    merge(left: Metadata, right: Metadata): Metadata
}


/**
 * 
 * @param metadatas 
 * @returns 
 */
export function InheritedMetadataManagerClass<Metadata extends object, Target>(metadatas?: [Target, Metadata][]): Constructor & InheritedMetadataManager<Metadata, Target> {
    return class extends MetadataManagerClass<Metadata, Target>(metadatas) {
        /**
         * Returns `true` if the target or any of its prototypes have metadata.
         * 
         * @param target
         * @returns
         */
        public static hasMetadata(target: Target): boolean {
            const targets = [target, ...getPrototypeChain(target)];
            return targets.some(t => super.hasMetadata(t));
        }

        /**
         * Merges the target's metadata with the metadatas of its prototypes
         * and returns the result.
         * 
         * @param target
         * @returns
         */
        public static getMetadata(target: Target): Metadata {
            const targets = [target, ...getPrototypeChain(target)];

            const metadataChain: Metadata[] = targets
                .reverse()
                .filter(t => super.hasMetadata(t))
                .map(t => super.getMetadata(t));

            if (!metadataChain.length)
                throw new Error(`No metadata for target: ${target}`);

            return metadataChain.reduce((m1, m2) => this.merge(m1, m2));
        }

        /**
         * Merges two Metadata objects and returns a new Metadata.
         * 
         * @param left
         * @param right
         * @returns
         */
        public static merge(left: Metadata | undefined, right: Metadata | undefined): Metadata {
            return shake(merge(left, right)) as Metadata;
        }

        /**
         * Returns true if the target its own (not inherited) metadata.
         * 
         * @param target
         * @returns
         */
        public static hasOwnMetadata(target: Target): boolean {
            return super.hasMetadata(target);
        }

        /**
         * The target's own (not inherited) metadata
         * @param target
         * @returns
         */
        public static getOwnMetadata(target: Target): Metadata {
            return super.getMetadata(target);
        }
    }
}