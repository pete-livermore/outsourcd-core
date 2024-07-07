export function camelToSnake(str: string) {
  return str
    .split(/(?=[A-Z])/)
    .join('_')
    .toLowerCase();
}

export function snakeToCamel(str: string) {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}

export function camelToSnakeKeys<T = any>(data: T) {
  if (data === null || data === undefined) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(camelToSnakeKeys);
  }

  if (typeof data === 'object' && !(data instanceof Date)) {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        camelToSnake(key),
        camelToSnakeKeys(value),
      ]),
    );
  }
  return data;
}

export function snakeToCamelKeys(data: any) {
  if (data === null || data === undefined) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(snakeToCamelKeys);
  }

  if (data instanceof Object && !(data instanceof Date)) {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const camelCaseKey = snakeToCamel(key);
        const value = data[key];

        if (value instanceof Object && !(value instanceof Date)) {
          data[camelCaseKey] = snakeToCamelKeys(value);
        } else {
          data[camelCaseKey] = value;
        }

        if (camelCaseKey !== key) {
          delete data[key];
        }
      }
    }
  }
  return data;
}
