import formatArray from './format-array';

describe('formatArray', () => {
  it('should format an array of 1 item', () => {
    const array = ['item1'];
    const formatted = formatArray(array);
    expect(formatted).toEqual('item1');
  });

  it('should format an array of 2 items', () => {
    const array = ['item1', 'item2'];
    const formatted = formatArray(array);
    expect(formatted).toEqual('item1 and item2');
  });

  it('should format an array of 3 items', () => {
    const array = ['item1', 'item2', 'item3'];
    const formatted = formatArray(array);
    expect(formatted).toEqual('item1, item2 and item3');
  });

  it('should format an array of 4 items', () => {
    const array = ['item1', 'item2', 'item3', 'item4'];
    const formatted = formatArray(array);
    expect(formatted).toEqual('item1, item2, item3 and item4');
  });

  it('should format an array with an empty item', () => {
    const array = [''];
    const formatted = formatArray(array);
    expect(formatted).toEqual('');
  });

  it('should format an array of 3 items with an empty item', () => {
    const array = ['item1', '', 'item3'];
    const formatted = formatArray(array);
    expect(formatted).toEqual('item1 and item3');
  });
});
