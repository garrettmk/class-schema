import { MaybeArray } from "@garrettmk/ts-utils";
import { MetadataManager } from "@garrettmk/metadata-manager";
import { TargetContext } from "./actions-manager";
import { applyActions } from "./apply-actions";
import { MetadataAction } from "./types";


export class MetadataActionSet<
    Metadata,
    Target,
    Actions extends MaybeArray<MetadataAction<Metadata, TargetContext<Target>>> = MaybeArray<MetadataAction<Metadata, TargetContext<Target>>>
> {
    public constructor(
        protected readonly metadata: MetadataManager<Metadata, Target>,
        protected readonly actions: Actions,
    ) {}

    public applyActions(...targets: Target[]) {
        if (!targets.length)
            targets.push(...this.metadata.entries().map(([target]) => target));

        for (const target of targets) {
            const metadata = this.metadata.getMetadata(target);
            const context = { target };

            const newMetadata = applyActions(metadata, context, this.actions);
            this.metadata.setMetadata(target, newMetadata);
        }
    }
}
