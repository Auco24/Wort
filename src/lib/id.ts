let counter = 0;

/** Short unique id that does not depend on crypto.randomUUID (unavailable in some contexts). */
export function uid(): string {
  counter = (counter + 1) % 1679616;
  return (
    Date.now().toString(36) +
    counter.toString(36).padStart(4, '0') +
    Math.floor(Math.random() * 1e9).toString(36)
  );
}
