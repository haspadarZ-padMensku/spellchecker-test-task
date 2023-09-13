import { getPositionOfWord, getWordsFromText } from '../../helpers';

describe('getWordsFromText', () => {
  it('should extract separate words from string', () => {
    expect(getWordsFromText('First,  test\n!!!>')).toStrictEqual(['First', 'test']);
  });
  it('should return empty array if input is empty', () => {
    expect(getWordsFromText('')).toStrictEqual([]);
  });
});

describe('getPositionOfWord', () => {
  it('should return the first index of the word', () => {
    expect(getPositionOfWord('First,  test\n!!!>', 'First')).toBe(0);
    expect(getPositionOfWord('First,  test\n!!!>', 'test')).toBe(8);
  });
});
