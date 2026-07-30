import { Transform } from 'class-transformer';

/**
 * Trim the value of the property
 *
 * @returns The trimmed value of the property
 */
function Trim() {
  return Transform(({ value }) => String(value).trim());
}

export default Trim;
