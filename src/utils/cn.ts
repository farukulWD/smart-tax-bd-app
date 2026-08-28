export function cn(...inputs: any[]): string {
  return inputs
    .flatMap((input) => {
      if (!input) return []; // skip falsy values (false, null, undefined, "")
      if (typeof input === 'string') return input.split(/\s+/); // split classes by space
      if (typeof input === 'object') {
        return Object.entries(input)
          .filter(([_, value]) => Boolean(value))
          .map(([key]) => key);
      }
      return [String(input)];
    })
    .filter(Boolean)
    .join(' ');
}
