# Security Rules

API routes, AI calls, GitHub integration, and database guidance below is
future/conditional. It is not permission to implement those systems in the
current free MVP; add them only when explicitly scoped.

---

## Input Validation

- All user input must be validated with Zod before processing.
- Schemas live in `lib/validation/`.
- Never pass raw user input to the AI model — sanitize and validate first.
- `project_description` max length: 2000 characters.
- Refinement options (skill level, stage, etc.) must be validated against allowed enum values.

---

## API Routes (Future / Conditional)

- All API routes must validate request body with the corresponding Zod schema.
- Return 400 for validation errors with a structured error response.
- Never expose raw database errors or stack traces to the client.
- Rate limit architecture generation endpoints (expensive AI call).

---

## AI Prompts (Future / Conditional)

- Use system prompts to constrain model behavior — do not rely on user-facing instructions.
- Do not include user input in system prompts.
- User input goes in the user message only, after escaping.
- Never log full AI responses in production — they may contain reflected user data.

---

## GitHub Integration (Future / Conditional)

- GitHub API calls are read-only (metadata only).
- Use a personal access token scoped to `public_repo:read` only.
- Cache GitHub responses — do not fetch on every architecture generation.

---

## Data

- Architecture IDs in URLs are UUIDs — validate format before querying.
- Do not expose `tool_id` or `capability_id` internals in public API responses if not needed.
- Outcome responses are future persistence work and must be associated with a
  valid architecture_id if that system is later built.
