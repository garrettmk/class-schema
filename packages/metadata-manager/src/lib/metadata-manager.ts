import { shake } from 'radash';
import { MetadataDict, MetadataManager } from './types';
import { getPrototypeChain, merge, Constructor } from '@garrettmk/ts-utils';

/**
 * Creates a new class implementing the `MetadataManager` interface. All
 * methods/properties of this class are static, so it essentially acts
 * as a "namespace" for a kind of metadata.
 * 
 * @param metadatas An initial set of `[Target, Metadata]` entries.
 * @returns A class implementing the `MetadataManager` interface.
 * 
 * @example
 * ```
 * const MyMetadataManager = MetadataManagerClass();
 * ```
 * 
 * @example
 * ```
 * class MyMetadataManager extends MetadataManagerClass() {
 *  // Provide custom functionality here
 * }
 * ```
 */
export function MetadataManagerClass<Metadata extends object, Target>(metadatas?: [Target, Metadata][]): Constructor & MetadataManager<Metadata, Target> {
  return class {
    /**
     * Maps a `Target` to a `Metadata`
     */
    public static metadatas = new Map<Target, Metadata>(metadatas);

    public static hasMetadata(target: Target): boolean {
      const targets = [target, ...getPrototypeChain(target)];
      return targets.some(t => this.metadatas.has(t));
    }

    /**
     * Returns the target's metadata, or throws an error.
     *
     * @param target
     * @returns The `Metadata` assigned to `target`
     */
    public static getMetadata(target: Target): Metadata {
      const targets = [target, ...getPrototypeChain(target)];

      const resolvedMeta = targets
        .reverse()
        .map(t => this.metadatas.get(t))
        .reduce((m1, m2) => shake(merge(m1, m2)) as Metadata);

      if (!resolvedMeta)
        throw new Error(`No metadata for target: ${target}`);

      return resolvedMeta;
    }

    /**
     * Assigns `meta` to `target`.
     *
     * @param target
     * @param meta
     */
    public static setMetadata(target: Target, meta: Metadata): void {
      this.metadatas.set(target, meta);
    }

    /**
     * Merges `meta` with the target's current metadata.
     *
     * @param target
     * @param meta
     */
    public static mergeMetadata(target: Target, meta: Metadata): void {
      const current = this.metadatas.get(target);
      this.metadatas.set(target, { ...current, ...meta });
    }

    /**
     * Returns all targets and their assigned metadata.
     *
     * @returns An array of `[Target, Metadata]` tuples
     */
    public static entries(): [Target, Metadata][] {
      return Array.from(this.metadatas.keys())
        .map(target => [target, this.getMetadata(target)]);
    }
  };
}