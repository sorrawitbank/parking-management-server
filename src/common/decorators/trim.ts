import { Transform } from 'class-transformer';

/**
 * Trim the value of the property
 *
 * @returns The trimmed value of the property
 */
function Trim() {
  return Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  );
}

export default Trim;
