import { Constructor } from '../types';

export interface MetadataManager<Metadata, Target> {
  hasMetadata(target: Target): boolean
  getMetadata(target: Target): Metadata
  setMetadata(target: Target, meta: Metadata): void
  mergeMetadatas(a: Metadata, b: Metadata): Metadata
}


export function MetadataManagerClass<Metadata, Target>(): Constructor & MetadataManager<Metadata, Target> {
  return class {
    protected static metadatas = new Map<Target, Metadata>();

    public static hasMetadata(target: Target): boolean {
      return this.metadatas.has(target);
    }

    public static getMetadata(target: Target): Metadata {
      const meta = this.metadatas.get(target);
        if (!meta) throw new Error(`No meta for target ${target}`);

      return meta;
    }

    public static setMetadata(target: Target, meta: Metadata) {
      this.metadatas.set(target, meta);
    }

    public static mergeMetadatas(a: Metadata, b: Metadata): Metadata {
      return b;
    }
  };
}
