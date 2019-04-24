export function capitalise(text: string): string {
  return text && text[0].toUpperCase() + text.slice(1).toLowerCase() || '';
}
