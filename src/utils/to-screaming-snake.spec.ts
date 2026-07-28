import toScreamingSnake from './to-screaming-snake';

describe('toScreamingSnake', () => {
  it('should convert a string to screaming snake case', () => {
    const result = toScreamingSnake('helloWorld');
    expect(result).toEqual('HELLO_WORLD');
  });

  it('should convert a first letter uppercase string to screaming snake case', () => {
    const result = toScreamingSnake('HelloWorld');
    expect(result).toEqual('HELLO_WORLD');
  });

  it('should convert a string with numbers to screaming snake case', () => {
    const result = toScreamingSnake('hello123World');
    expect(result).toEqual('HELLO123_WORLD');
  });

  it('should return an empty string if the input is empty', () => {
    const result = toScreamingSnake('');
    expect(result).toEqual('');
  });

  it('should throw an error if the input has any invalid format', () => {
    expect(() => toScreamingSnake('helloWorld?')).toThrow(Error);
    expect(() => toScreamingSnake('hello_world')).toThrow(Error);
    expect(() => toScreamingSnake('hello!World')).toThrow(Error);
  });
});
