/**
 * Formats a float or decimal duration of months into a human-readable string
 * containing whole years and remaining months.
 * 
 * - If months < 12: displays "X months" (or "mois", "meses").
 * - If months >= 12: displays "X years and Y months" (localized properly, e.g. "1 an et 6 mois").
 * 
 * Accurately prevents displaying any decimal values.
 */
export function formatDisplayDuration(totalMonths: number, language: string = 'fr'): string {
  const roundedMonths = Math.round(totalMonths);
  const years = Math.floor(roundedMonths / 12);
  const months = Math.round(roundedMonths % 12);
  
  if (language === 'fr') {
    if (years === 0) {
      return months + ' mois';
    } else if (months === 0) {
      return years + ' an' + (years > 1 ? 's' : '');
    } else {
      return years + ' an' + (years > 1 ? 's' : '') + ' et ' + months + ' mois';
    }
  } else if (language === 'es') {
    if (years === 0) {
      return months + ' meses';
    } else if (months === 0) {
      return years + ' año' + (years > 1 ? 's' : '');
    } else {
      return years + ' año' + (years > 1 ? 's' : '') + ' y ' + months + ' meses';
    }
  } else {
    // English
    if (years === 0) {
      return months + ' months';
    } else if (months === 0) {
      return years + ' year' + (years > 1 ? 's' : '');
    } else {
      return years + ' year' + (years > 1 ? 's' : '') + ' and ' + months + ' months';
    }
  }
}
