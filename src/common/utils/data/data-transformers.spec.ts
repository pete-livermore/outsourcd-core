import { parseKeyString } from './data-transformers';

describe('parseKeyString', () => {
  it('should correctly parse keys enclosed in square brackets with single quotes', () => {
    const inputString1 = "['key1,'key2']";
    const inputString2 = "['key1', 'key2']";
    const inputString3 = "['key1',   'key2']";

    expect(parseKeyString(inputString1)).toEqual(['key1', 'key2']);
    expect(parseKeyString(inputString2)).toEqual(['key1', 'key2']);
    expect(parseKeyString(inputString3)).toEqual(['key1', 'key2']);
  });

  it('should handle empty input', () => {
    const inputString = '[]';
    expect(parseKeyString(inputString)).toEqual([]);
  });

  it('should handle no content within square brackets', () => {
    const inputString = 'random text without brackets';

    expect(parseKeyString(inputString)).toEqual([]);
  });
});
