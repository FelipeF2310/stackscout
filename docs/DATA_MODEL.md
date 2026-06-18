# Data Model

## Entities

### Capability

| Field | Type | Notes |
|---|---|---|
| capability_id | string (slug) | Stable, kebab-case. e.g. `vector-storage` |
| name | string | Title Case. e.g. `Vector Storage` |
| description | string | One sentence. "X for Y" format. |
| category | enum | `auth`, `data`, `ai`, `infrastructure`, `observability`, `communication`, `payments`, `frontend` |

Capabilities are canonical and stable. They don't change with tool popularity.

---

### Tool

| Field | Type | Notes |
|---|---|---|
| tool_id | string (slug) | Stable, kebab-case. e.g. `vercel-ai-sdk` |
| repository_name | string | GitHub `owner/repo` format |
| github_url | string | Full GitHub URL |
| capability_ids | string[] | One or more capability_ids this tool fulfills |
| maintenance_score | float 0–1 | Based on last push date and archived status |
| maturity_score | float 0–1 | Based on stars, age, and adoption signals |
| documentation_score | float 0–1 | Based on documentation quality signals |
| beginner_friendly | boolean | Does this tool have low onboarding friction? |
| production_ready | boolean | Is this tool suitable for production workloads? |
| managed | boolean | Is this a managed/hosted service vs self-hosted? |
| ecosystems | string[] | e.g. `["typescript", "python"]` |

---

### Relationship

| Field | Type | Notes |
|---|---|---|
| relationship_id | string | Stable slug. e.g. `rel-001` |
| source_tool_id | string | References Tool.tool_id |
| target_tool_id | string | References Tool.tool_id |
| relationship_type | enum | See Relationship Types below |
| confidence_score | float 0–1 | How confident is this relationship? |
| source_of_truth | enum | `manual` in Phase 1 |

#### Relationship Types

- `compatible-with` — tools work well together without configuration friction
- `alternative-to` — tools serve the same capability and can replace each other
- `commonly-used-with` — tools are frequently chosen together
- `better-for-beginners` — source has lower onboarding friction than target
- `better-for-production` — source is more suitable for production than target
- `managed-alternative` — source is a managed version of what target offers self-hosted
- `self-hosted-alternative` — source is a self-hosted version of what target offers managed

---

### Architecture

| Field | Type | Notes |
|---|---|---|
| architecture_id | uuid | Generated at creation |
| project_description | string | User input verbatim. Not sanitized. |
| selected_capabilities | string[] | capability_ids |
| selected_tools | json | Array of `{ tool_id, capability_id, rationale }` |
| recommendation_rationale | json | Per-tool rationale map + overall architecture rationale |
| created_at | timestamp | |

---

### Architecture Outcome

| Field | Type | Notes |
|---|---|---|
| outcome_id | uuid | |
| architecture_id | uuid | References Architecture |
| status | enum | `using-as-recommended`, `modified-slightly`, `replaced-multiple`, `abandoned` |
| modifications | string? | Free text |
| replaced_tools | string[]? | tool_ids of replaced tools |
| feedback | string? | Free text, max 1000 chars |
| recorded_at | timestamp | |
