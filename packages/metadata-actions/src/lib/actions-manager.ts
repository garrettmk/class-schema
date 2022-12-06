import { Constructor, MaybeArray } from "@garrettmk/ts-utils";
import { MetadataManager, MetadataManagerClass } from "@garrettmk/metadata-manager";
import { applyActions } from "./apply-actions";
import { MetadataAction } from "./types";


export interface TargetContext<T> {
    target: T
}

export interface MetadataActionsManager<Metadata, Target, Actions = MaybeArray<MetadataAction<Metadata, TargetContext<Target>>>> extends MetadataManager<Actions, Target> {
    hasActions: (target: Target) => boolean
    setActions: (target: Target, actions: Actions) => void
    getActions: (target: Target) => Actions
    removeActions: (target: Target) => void
    updateActions: (target: Target, actionsFn: (actions?: Actions) => Actions) => void
    applyActions(): void
}

export function MetadataActionManagerClass<
    Metadata, 
    Target, 
    Actions extends MaybeArray<MetadataAction<Metadata, TargetContext<Target>>> = MaybeArray<MetadataAction<Metadata, TargetContext<Target>>>
>(
    metadataManager: MetadataManager<Metadata, Target>
): Constructor & MetadataActionsManager<Metadata, Target, Actions> {
    
    return class extends MetadataManagerClass<Actions, Target>() {
        public static hasActions(target: Target) {
            return this.hasMetadata(target);
        }
        public static setActions(target: Target, actions: Actions) {
            this.setMetadata(target, actions);
        }

        public static getActions(target: Target) {
            return this.getMetadata(target);
        }

        public static removeActions(target: Target) {
            return this.removeMetadata(target);
        }

        public static updateActions(target: Target, actionsFn: (actions?: Actions) => Actions) {
            this.updateMetadata(target, actionsFn);
        }

        public static applyActions() {
            this.entries().forEach(([target, actions]) => {
                const metadata = metadataManager.getMetadata(target);
                const context = { target };

                const newMetadata = applyActions(metadata, context, actions);
                metadataManager.setMetadata(target, newMetadata);

                this.removeActions(target);
            });
        }
    };

}