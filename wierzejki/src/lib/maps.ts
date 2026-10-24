/** Link do wyznaczenia trasy w Mapach Google (otwierany w nowej karcie, bez osadzania). */
export function directionsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
