import {
  camelToSnakeKeys,
  snakeToCamel,
  camelToSnake,
  snakeToCamelKeys,
} from './data-transformers';

describe('camelToSnake', () => {
  describe('when passed a string', () => {
    it('should convert the string from camel to snake case', () => {
      const camelCaseStr = 'thisIsCamelCase';
      const result = camelToSnake(camelCaseStr);
      expect(result).toBe('this_is_camel_case');
    });
  });
});

describe('snakeToCamel', () => {
  describe('when passed a string', () => {
    it('should convert the string from snake to camel case', () => {
      const snakeCaseStr = 'this_is_snake_case';
      const result = snakeToCamel(snakeCaseStr);
      expect(result).toBe('thisIsSnakeCase');
    });
  });
});

describe('camelToSnakeKeys', () => {
  describe('when passed an object with a nested object', () => {
    let object: Record<string, any>;

    beforeEach(() => {
      object = {
        property: 'value',
        anotherProperty: { nestedProperty: 'nested value' },
      };
    });

    it('should convert all camel case object keys to snake case', () => {
      const result = camelToSnakeKeys(object);
      expect(result).toStrictEqual({
        property: 'value',
        another_property: { nested_property: 'nested value' },
      });
    });
  });

  describe('when passed an object with a nested array of objects', () => {
    let object: Record<string, any>;

    beforeEach(() => {
      object = {
        property: 'value',
        anotherProperty: [
          { nestedProperty: 'nested value' },
          { anotherNestedProperty: 'another nested value' },
        ],
      };
    });

    it('should convert all camel case object keys to snake case', () => {
      const result = camelToSnakeKeys(object);
      expect(result).toStrictEqual({
        property: 'value',
        another_property: [
          { nested_property: 'nested value' },
          { another_nested_property: 'another nested value' },
        ],
      });
    });
  });
});

describe('snakeToCamelKeys', () => {
  describe('when passed an object with a nested object', () => {
    let object: Record<string, any>;

    beforeEach(() => {
      object = {
        property: 52,
        another_property: { nested_property: 'nestedValue' },
      };
    });

    it('should convert all snake case object keys to camel case', () => {
      const result = snakeToCamelKeys(object);
      expect(result).toStrictEqual({
        property: 52,
        anotherProperty: { nestedProperty: 'nestedValue' },
      });
    });
  });

  describe('when passed an object with a nested array of objects', () => {
    let object: Record<string, any>;

    beforeEach(() => {
      object = {
        property: 'value',
        another_property: [
          { nested_property: 'nested value' },
          { another_nested_property: 'another nested value' },
        ],
      };
    });

    it('should convert all snake case object keys to camel case', () => {
      const result = snakeToCamelKeys(object);
      expect(result).toStrictEqual({
        property: 'value',
        anotherProperty: [
          { nestedProperty: 'nested value' },
          { anotherNestedProperty: 'another nested value' },
        ],
      });
    });
  });
});
