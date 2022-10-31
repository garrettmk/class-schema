import { shake } from 'radash';
import { getPrototypeChain } from './util/get-prototype-chain';
import { merge } from './util/merge';

export interface MetadataManager<M, T> {
  new (): {};
  metas: Map<T, M>;
  hasOwnMeta(target: T): boolean;
  getOwnMeta(target: T): M;
  getResolvedMeta(target: T): M;
  mergeMetas(a: M, b: M): M;
  setOwnMeta(target: T, meta: M): void;
}

export function MetadataManagerClass<M extends object, T>(): MetadataManager<
  M,
  T
> {
  return class {
    public static metas = new Map<T, M>();

    public static hasOwnMeta(target: T): boolean {
      return this.metas.has(target);
    }

    public static getOwnMeta(target: T): M {
      const meta = this.metas.get(target);
      if (!meta) throw new Error(`No meta for target ${target}`);

      return meta;
    }

    public static getResolvedMeta(target: T): M {
      const targets = [target, ...getPrototypeChain(target)] as T[];

      return targets
        .reverse()
        .filter(this.hasOwnMeta)
        .map(this.getOwnMeta)
        .reduce(this.mergeMetas);
    }

    public static mergeMetas(a: M, b: M): M {
      return shake(merge(a, b)) as M;
    }

    public static setOwnMeta(target: T, meta: M) {
      this.metas.set(target, meta);
    }
  };
}
