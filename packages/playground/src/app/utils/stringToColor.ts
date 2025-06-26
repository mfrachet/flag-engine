// Simple hash function for strings
function simpleHash(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Version with HSL for better color distribution and vibrancy
export function stringToColor(str: string, lightness: number = 70) {
  const hash1 = simpleHash(str);
  const hash2 = simpleHash(str + "hue_salt");

  // Hue: full spectrum (0-360)
  const hue = hash1 % 360;

  // Saturation: 40-100% for vibrant colors
  const saturation = 40 + (hash2 % 60);

  // Lightness: 45-75% for good readability

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
