export function getRatingLabel(rating: number): string {
  if (rating <= 1.7) return 'Mauvais';
  if (rating <= 2.7) return 'Faible';
  if (rating <= 3.7) return 'Moyen';
  if (rating <= 4.2) return 'Bien';
  return 'Excellent';
}
