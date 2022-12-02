import { BaseObject } from "./base-object";
import { Class, Property } from "./class-schema-decorators";
import { primaryKey, unique, abstract, entity } from "./util/flags";
import { Id } from "./custom-types/id";


@Class({ abstract, entity, description: 'A base class for persisted entities' })
export abstract class BaseModel extends BaseObject {
  @Property(() => Id, { primaryKey, unique, description: 'The model\'s unique ID' })
  id!: Id;
}

export type BaseModelConstructor = typeof BaseModel;