
export class MetadataIterator<Metadata, Target> {
    constructor(protected entries: [Target, Metadata][]) {}

    public forEach(callback: (target: Target, metadata: Metadata) => void): MetadataIterator<Metadata, Target> {
        this.entries.forEach(([target, metadata]) => callback(target, metadata));
        return this;
    }

    public filter(callback: (target: Target, metadata: Metadata) => unknown): MetadataIterator<Metadata, Target> {
        this.entries = this.entries.filter(([target, metadata]) => Boolean(callback(target, metadata)));
        return this;
    }

    public map<R>(callback: (target: Target, metadata: Metadata) => R): R[] {
        return this.entries.map(([target, metadata]) => callback(target, metadata));
    }

    public reduce<R>(callback: (result: R, target: Target, metadata: Metadata) => R, initial: R): R {
        return this.entries.reduce(
            (result, [target, metadata]) => callback(result, target, metadata),
            initial
        );
    }
}