import { BaseObject } from "./base-object";
import { Class } from "./class-metadata/class-decorator";
import { Property } from "./property-metadata/property-decorator";
import { primaryKey, unique, abstract, entity } from "./util/flags";
import { Id } from "./custom-types/id";


@Class({ abstract, entity, description: 'A base class for persisted entities' })
export class BaseModel extends BaseObject {
  @Property(() => Id, { primaryKey, unique, description: 'The model\'s unique ID' })
  id!: Id;
}

export type BaseModelConstructor = typeof BaseModel;