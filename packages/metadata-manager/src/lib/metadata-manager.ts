import { Constructor } from '@garrettmk/ts-utils';

/**
 * A metadata manager class.
 */
export interface MetadataManager<Metadata, Target = unknown> {
  metadatas: Map<Target, Metadata>;
  hasMetadata: (target: Target) => boolean;
  getMetadata: (target: Target) => Metadata;
  setMetadata: (target: Target, meta: Metadata) => void;
  removeMetadata: (target: Target) => void;
  updateMetadata: (target: Target, callback: (metadata?: Metadata) => Metadata) => void;
  entries: () => [Target, Metadata][];
}


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
export function MetadataManagerClass<Metadata, Target>(metadatas?: [Target, Metadata][]): Constructor & MetadataManager<Metadata, Target> {
  return class {
    /**
     * Maps a `Target` to a `Metadata`
     */
    public static metadatas = new Map<Target, Metadata>(metadatas);

    public static hasMetadata(target: Target): boolean {
      return this.metadatas.has(target);
    }

    /**
     * Returns the target's metadata, or throws an error.
     *
     * @param target
     * @returns The `Metadata` assigned to `target`
     */
    public static getMetadata(target: Target): Metadata {
      const metadata = this.metadatas.get(target);

      if (!metadata)
        throw new Error(`No metadata for target: ${target}`);

      return metadata;
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
     * Remove metadata for `target`.
     * 
     * @param target 
     */
    public static removeMetadata(target: Target): void {
      this.metadatas.delete(target);
    }

    /**
     * Assigns the result of `callback` to `target`.
     * 
     * @param target
     * @param callback
     */
    public static updateMetadata(target: Target, callback: (metadata?: Metadata) => Metadata): void {
      const result = this.hasMetadata(target)
        ? callback(this.getMetadata(target))
        : callback();

      this.setMetadata(target, result);
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