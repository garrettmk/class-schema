import { BaseObject } from "./base-object";
import { Property } from "./class-schema-decorators";
import { primaryKey, unique } from "./util/flags";
import { Id } from "./custom-types/id";


export abstract class BaseModel extends BaseObject {
  @Property(() => Id, { primaryKey, unique, description: 'The model\'s unique ID' })
  id!: Id;
}

export type BaseModelConstructor = typeof BaseModel;