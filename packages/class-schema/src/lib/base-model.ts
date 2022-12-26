import { BaseObject } from "./base-object";
import { Class } from "./decorators/class-decorator";
import { Property } from "./decorators/property-decorator";
import { primaryKey, unique, abstract, entity } from "./util/flags";
import { Id } from "./custom-types/id";


@Class({ abstract, entity, description: 'A base class for persisted entities' })
export class BaseModel extends BaseObject {
  @Property(() => Id, { primaryKey, unique, description: 'The model\'s unique ID' })
  id!: string;
}

export type BaseModelConstructor = typeof BaseModel;