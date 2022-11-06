import { shake } from 'radash';
import { Constructor, MetadataDict, MetadataManager } from './types';
import { getPrototypeChain } from './util/get-prototype-chain';
import { merge } from './util/merge';


export function MetadataManagerClass<Metadata extends MetadataDict, Target>(metadatas?: [Target, Metadata][]): Constructor & MetadataManager<Metadata, Target> {
  return class {
    protected static metadatas = new Map<Target, Metadata>(metadatas);

    public static hasMetadata(target: Target): boolean {
      const targets = [target, ...getPrototypeChain(target)];
      return targets.some(t => this.metadatas.has(t));
    }

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

    public static setMetadata(target: Target, meta: Metadata): void {
      this.metadatas.set(target, meta);
    }

    public static mergeMetadata(target: Target, meta: Metadata): void {
      const current = this.metadatas.get(target);
      this.metadatas.set(target, { ...current, ...meta });
    }

    public static entries(): [Target, Metadata][] {
      return Array.from(this.metadatas);
    }
  };
}
