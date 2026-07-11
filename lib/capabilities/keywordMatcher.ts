// Boundary-safe phrase compiler shared by keyword detection
// (detectCapabilities.ts) and project-shape inference (projectShapes.ts).
// Moved here so both consumers use one matcher and neither imports the other
// at runtime. Semantics are unchanged from the detector hardening pass:
//   - regex specials are escaped,
//   - multi-word phrases match across any whitespace,
//   - normal phrases also accept a trailing plural 's',
//   - `stem: true` phrases match any word continuation
//     (e.g. 'summar' → "summarize", "summary"; 'deploy' → "deploying").

export interface CompileOptions {
  stem?: boolean
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function compilePhrase(phrase: string, opts?: CompileOptions): RegExp {
  const tokens = phrase.trim().split(/\s+/).map(escapeRegExp)
  const body = tokens.join('\\s+')
  // Stems match any word continuation; normal phrases also accept a plural 's'.
  return opts?.stem
    ? new RegExp(`\\b${body}\\w*`)
    : new RegExp(`\\b${body}(?:s)?\\b`)
}
