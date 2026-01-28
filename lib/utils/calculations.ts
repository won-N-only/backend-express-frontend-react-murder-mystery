export function calculateCompletionRate(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100 * 100) / 100;
}

export function formatCompletionRate(completed: number, total: number): string {
  return `${completed}/${total} (${calculateCompletionRate(completed, total)}%)`;
}
