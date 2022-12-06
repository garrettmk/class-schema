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
    protected readonly targets = new Set<Target>();

    public constructor(
        protected readonly metadata: MetadataManager<Metadata, Target>,
        protected readonly actions: Actions,
    ) {}

    public addTarget(target: Target) {
        this.targets.add(target);
    }

    public removeTarget(target: Target) {
        this.targets.delete(target);
    }

    public applyActions() {
        for (const target of this.targets) {
            const metadata = this.metadata.getMetadata(target);
            const context = { target };

            const newMetadata = applyActions(metadata, context, this.actions);
            this.metadata.setMetadata(target, newMetadata);

            this.removeTarget(target);
        }
    }
}
