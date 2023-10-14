export default function first<T>(input: T | T[]): T {
  return Array.isArray(input) ? input[0] : input;
}
