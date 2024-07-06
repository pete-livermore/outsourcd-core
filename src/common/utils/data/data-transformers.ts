export function parseKeyString(inputString): string[] {
  const contentMatch = inputString.match(/\[(.*?)\]/);

  if (!contentMatch) {
    return [];
  }

  const content = contentMatch[1];
  if (!content.trim()) {
    return [];
  }

  const keys = content.replace(/'/g, '').split(',');
  const trimmedKeys = keys.map((key) => key.trim());
  return trimmedKeys;
}
