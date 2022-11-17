import { faker } from '@faker-js/faker';
import { BooleanPropertyMetadata, DatePropertyMetadata, NumberPropertyMetadata, StringPropertyMetadata } from '../class-schema-types';
import { fakerMaker } from './faker-maker';
import { TypeFn } from './types';
import { random } from 'radash';
import { generateNumber } from './generate-number';
import { flip } from 'common';


export function booleanFieldFaker(metadata: BooleanPropertyMetadata): TypeFn<boolean> {
  return fakerMaker(metadata, faker.datatype.boolean);
}

export function stringFieldFaker(metadata: StringPropertyMetadata): TypeFn<string> {
  const { maxLength, minLength = 0, in: _in } = metadata;
  let fakerFn: TypeFn;

  if (_in) 
    fakerFn = () => faker.helpers.arrayElement(_in);
  else
    fakerFn = () => {
      const length = maxLength !== undefined ? random(minLength, maxLength) : undefined;
      return faker.datatype.string(length);
    };

  return fakerMaker(metadata, fakerFn);
}

export function dateFieldFaker(metadata: DatePropertyMetadata): TypeFn<Date> {
  const { min, max } = metadata;
  let fakerFn: TypeFn;

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


export function floatFieldFaker(metadata: NumberPropertyMetadata): TypeFn<number> {
  const { min, max, eq, ne, in: _in, nin } = metadata;
  let fakerFn: TypeFn;

  if (eq)
    fakerFn = () => eq;

  if (_in)
      fakerFn = () => faker.helpers.arrayElement(_in);
  
  else
      fakerFn = () => generateNumber({ min, max });

  return fakerMaker(metadata, fakerFn);
}


export function intFieldFaker(metadata: NumberPropertyMetadata): TypeFn<number> {
  const { min, max, eq, ne, in: _in, nin } = metadata;
  let fakerFn: TypeFn;

  if (eq)
    fakerFn = () => eq;

  if (_in)
      fakerFn = () => faker.helpers.arrayElement(_in)

  else
      fakerFn = () => generateNumber({ min, max, decimals: 0 });

  return fakerMaker(metadata, fakerFn);
}


export function numberFieldFaker(field: NumberPropertyMetadata): TypeFn<number> {
  return () => flip(intFieldFaker(field), floatFieldFaker(field))();
}