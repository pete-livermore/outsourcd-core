export function toBool({ value }) {
  return Object.entries(value).reduce((acc, [key, val]) => {
    acc[key] = val === 'true';
    return acc;
  }, {});
}
