import { faker } from '@faker-js/faker';
import { Enum, PropertyMetadata } from '../class-schema-types';
import { fakerMaker } from './faker-maker';
import { TypeFn } from './types';
import { random } from 'radash';
import { generateNumber } from './generate-number';
import { flip } from '@garrettmk/ts-utils';
import { Id, IdConstructor } from '../custom-types/id';
import { getTypeInfo } from './get-type-info';
import { FloatConstructor } from '../custom-types/float';
import { IntConstructor } from '../custom-types/int';


export function booleanFieldFaker(metadata: PropertyMetadata<BooleanConstructor | BooleanConstructor[]>) {
  return fakerMaker(metadata, faker.datatype.boolean);
}

export function stringFieldFaker(metadata: PropertyMetadata<StringConstructor | StringConstructor[]>) {
  const { maxLength, minLength = 0, in: _in } = metadata;
  let fakerFn: TypeFn<string>;

  if (_in) 
    fakerFn = () => faker.helpers.arrayElement(_in);
  else
    fakerFn = () => {
      const length = maxLength !== undefined ? random(minLength, maxLength) : undefined;
      return faker.datatype.string(length);
    };

  return fakerMaker(metadata, fakerFn);
}

export function dateFieldFaker(metadata: PropertyMetadata<DateConstructor | DateConstructor[]>) {
  const { min, max } = metadata;
  let fakerFn: TypeFn<Date>;

  if (min !== undefined && max !== undefined)
      fakerFn = () => faker.date.between(min, max);

  else if (min !== undefined)
      fakerFn = () => new Date(faker.datatype.number({ min: min.getTime(), max: (new Date()).getTime() + 10000000 }));

  else if (max !== undefined)
      fakerFn = () => new Date(faker.datatype.number({ min: 0, max: max.getTime() }));

  else
      fakerFn = () => faker.date.recent();

  return fakerMaker(metadata, fakerFn);
}


export function floatFieldFaker(metadata: PropertyMetadata<FloatConstructor | FloatConstructor[]>) {
  const { min, max, eq, ne, in: _in, nin } = metadata;
  let fakerFn: TypeFn<number>;

  if (eq)
    fakerFn = () => eq;

  if (_in)
      fakerFn = () => faker.helpers.arrayElement(_in);
  
  else
      fakerFn = () => generateNumber({ min, max });

  return fakerMaker(metadata, fakerFn);
}


export function intFieldFaker(metadata: PropertyMetadata<IntConstructor | IntConstructor[]>) {
  const { min, max, eq, ne, in: _in, nin } = metadata;
  let fakerFn: TypeFn<number>;

  if (eq)
    fakerFn = () => eq;

  if (_in)
      fakerFn = () => faker.helpers.arrayElement(_in)

  else
      fakerFn = () => generateNumber({ min, max, decimals: 0 });

  return fakerMaker(metadata, fakerFn);
}


export function numberFieldFaker(metadata: PropertyMetadata<NumberConstructor | NumberConstructor[]>) {
  // @ts-expect-error too lazy to cast
  return () => flip(intFieldFaker(metadata), floatFieldFaker(metadata))();
}

export function idFieldFaker(metadata: PropertyMetadata<IdConstructor | IdConstructor[]>) {
  return fakerMaker(metadata, () => Id.fake())
}

export function enumFieldFaker(metadata: PropertyMetadata<Enum | Enum[], string | number>) {
  const { innerType } = getTypeInfo(metadata.type as TypeFn<Enum>);
  const values = Object.values(innerType);
  const fakerFn = () => faker.helpers.arrayElement(values);

  return fakerMaker(metadata, fakerFn);
}