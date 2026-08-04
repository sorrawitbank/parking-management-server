import ErrorType from '../errors/error-type';

function toScreamingSnake(string: string) {
  if (!string.match(/^[a-zA-Z0-9]*$/)) {
    throw new Error(ErrorType.INVALID_FORMAT);
  }

  return string
    .replace(/([A-Z])/g, '_$1')
    .toUpperCase()
    .replace(/^_+/, '');
}

export default toScreamingSnake;
