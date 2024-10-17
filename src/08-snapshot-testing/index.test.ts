// Uncomment the code below and write your tests
import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  const values1 = [1, 2, 3];
  const values2 = ['foo', 'bar', 'baz'];
  const expectedList = {
    value: 1,
    next: {
      value: 2,
      next: {
        value: 3,
        next: { value: null, next: null },
      },
    },
  };
  test('should generate linked list from values 1', () => {
    const result = generateLinkedList(values1);
    expect(result).toStrictEqual(expectedList);
  });

  test('should generate linked list from values 2', () => {
    const result = generateLinkedList(values2);
    expect(result).toMatchSnapshot();
  });
});
