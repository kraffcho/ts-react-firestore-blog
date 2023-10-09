// Functions to generate a unique color for each category name
// and use it as a background color for the category label

// First, we need to convert a string into a hash
export function stringToHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash;
}

// Then we convert the hash into a color
export function hashToColor(hash: number): string {
  const r = (hash & 0xff0000) >> 16;
  const g = (hash & 0x009900) >> 8;
  const b = hash & 0x0000ee;
  return `rgb(${r}, ${g}, ${b})`;
}

// And finally, we combine the two functions
export function categoryNameToColor(categoryName: string): string {
  const hash = stringToHash(categoryName);
  return hashToColor(hash);
}
