import { sql } from 'drizzle-orm';

/**
 * Returns the first non-null expression from the provided list of expressions.
 *
 * ## Examples
 *
 * ```ts
 * // Selects the first non-null value from the `discount` column or 0 if it is null.
 * db.select({ discount: coalesce(cars.discount, 0) }).from(cars)
 *
 * // Selects the first non-null value from the `discount`, `price - salePrice`, or 0 if both are null.
 * db.select({ discount: coalesce(cars.discount, cars.price - cars.salePrice, 0) }).from(cars)
 * ```
 */
function coalesce(...expressions: any[]) {
  const templateStringsArray = [
    'coalesce(',
    ...new Array(expressions.length - 1).fill(', '),
    ')',
  ] as unknown as TemplateStringsArray;

  return sql(templateStringsArray, ...expressions);
}

export default coalesce;
