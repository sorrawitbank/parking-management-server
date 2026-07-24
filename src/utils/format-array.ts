function formatArray(items: string[]) {
  const filteredItems = items.filter((item) => Boolean(item));

  if (filteredItems.length === 0) {
    return '';
  }

  if (filteredItems.length === 1) {
    return filteredItems[0];
  }

  if (filteredItems.length === 2) {
    return filteredItems.join(' and ');
  }

  return `${filteredItems.slice(0, -1).join(', ')} and ${filteredItems.at(-1)}`;
}

export default formatArray;
