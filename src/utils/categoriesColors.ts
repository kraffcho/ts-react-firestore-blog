// Generate a hash from a string
export function stringToHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash;
}

// Convert a hash into an RGB color
export function hashToColor(hash: number): string {
  const r = (hash & 0xff0000) >> 16;
  const g = (hash & 0x00ff00) >> 8;
  const b = hash & 0x0000ff;
  return `rgb(${r}, ${g}, ${b})`;
}

// Convert category name to a unique color
export function categoryNameToColor(categoryName: string): string {
  const hash = stringToHash(categoryName);
  return hashToColor(hash);
}
