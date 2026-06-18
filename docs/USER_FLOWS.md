# User Flows

## Primary Flow — Architecture Generation

### Step 1: Homepage
User lands on `/`. Sees the prompt: "What are you building?"

Component: `components/prompt/ProjectPrompt.tsx`

### Step 2: Submit Project Description
User types a project description and submits.

Example: "Build a PDF chatbot for internal company documents."

Validation: minimum 10 characters, maximum 2000.

### Step 3: Architecture Generated
User is redirected to `/architecture/[id]`.

The system:
1. Detects required capabilities
2. Scores and selects tools per capability
3. Generates rationale and explanations

User sees:
- `ArchitectureSummary` — overall architecture rationale
- `CapabilityList` — detected capabilities
- `RecommendedStack` — tools per capability
- `ToolRecommendationCard` — per tool: name, simple explanation, tradeoffs
- `AlternativeTools` — alternatives per capability
- `TradeoffExplainer` — opt-in technical depth

### Step 4: Optional Refinement
User can refine via `RefinementPanel`:
- Skill level: Beginner / Intermediate / Advanced
- Project stage: Prototype / Production / Enterprise
- Hosting: Managed / Self-hosted
- Ecosystem: TypeScript / Python / Mixed
- Model: OpenAI / Anthropic / Open Source / No Preference

Recommendations update when refinement changes.

### Step 5: Save Architecture
User saves the architecture. Stored in database. Accessible at `/saved`.

---

## Secondary Flow — Saved Architectures

User visits `/saved`. Sees list of saved architectures.

Clicking one returns to `/architecture/[id]`.

---

## Tertiary Flow — 14-Day Outcome Survey

14 days after architecture is saved, user sees a prompt at `/feedback/[architectureId]`.

Component: `components/feedback/OutcomeSurvey.tsx`

Questions:
1. Are you still using this architecture?
   - Using as recommended
   - Modified slightly
   - Replaced multiple components
   - Abandoned

2. (If modified/replaced) Which tools did you replace?

3. (Optional) What changed?

Outcome is recorded via `lib/outcomes/recordOutcome.ts`.
