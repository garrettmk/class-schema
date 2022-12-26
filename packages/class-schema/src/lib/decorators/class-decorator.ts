import { Constructor } from "@garrettmk/ts-utils";
import { ClassMetadataManager } from "../managers/class-metadata-manager";
import { ClassMetadata } from "../types";

/**
 * Registers a class with ClassMetadataManager.
 * 
 * @param meta
 * @returns
 */
export function Class(meta: ClassMetadata = {}): ClassDecorator {
    return function (_target) {
        const target = _target as unknown as Constructor;

        ClassMetadataManager.setMetadata(target, meta);
    }
}