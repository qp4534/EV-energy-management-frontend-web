export function createPlaceholderImage(width, height, bgColor, text) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <rect width="100%" height="100%" fill="${bgColor}" />
      <text x="50%" y="50%" fill="#FFFFFF" font-size="28" font-family="sans-serif"
            text-anchor="middle" dominant-baseline="middle">${text}</text>
    </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
