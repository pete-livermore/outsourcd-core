import { ParseSnakeCasePipe } from './parse-snake-case.pipe';

describe('ParseSnakeCasePipe', () => {
  let parseSnakeCasePipe: ParseSnakeCasePipe;

  beforeEach(() => {
    parseSnakeCasePipe = new ParseSnakeCasePipe();
  });

  describe('when the transform method is called', () => {
    describe('and it is passed an object with snake case keys', () => {
      it('should convert all snake case properties to camel case', () => {
        const value = {
          property_name: 'value',
          another_property: 'another value',
        };
        const result = parseSnakeCasePipe.transform(value, {
          type: 'query',
        });
        expect(result).toStrictEqual({
          propertyName: 'value',
          anotherProperty: 'another value',
        });
      });
    });

    describe('and it is passed an object with nested objects', () => {
      it('should convert all nested snake case properties to camel case', () => {
        const value = {
          property_name: 'value',
          another_property: { nested_property: 'nested value' },
        };
        const result = parseSnakeCasePipe.transform(value, {
          type: 'query',
        });
        expect(result).toStrictEqual({
          propertyName: 'value',
          anotherProperty: { nestedProperty: 'nested value' },
        });
      });
    });
  });
});
