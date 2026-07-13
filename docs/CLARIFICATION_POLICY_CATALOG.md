# Clarification Policy Catalog

This document governs when StackScout asks a clarification question, corrects
detector precision, applies a conservative default, or defers a policy. It does
not define a runtime registry, generic clarification engine, or implementation
queue. See [`PRODUCT_ROADMAP.md`](./PRODUCT_ROADMAP.md) for phase direction and
[`NEXT_STEPS.md`](./NEXT_STEPS.md) for the active queue.

## 1. Purpose and boundaries

StackScout asks a question only for a narrowly defined decision that the builder
can answer and whose answer materially changes capabilities or selected tools.

- Correct known detector precision errors automatically; do not ask the builder
  to compensate for a wrong interpretation.
- Use a transparent conservative default for low-impact uncertainty when adding
  more infrastructure would be unsupported.
- Treat explicit requirements and valid known context as authoritative; they
  bypass questions they already answer.
- Keep final recommendations deterministic and grounded in trusted structured
  capability and tool data.
- Do not turn this catalog into runtime policy loading, a generic intake form,
  or a reason to add another question without product evidence.

## 2. Policy-entry template

Every future policy records:

1. **Policy ID**
2. **Lifecycle:** implemented, candidate, deferred, or rejected
3. **Treatment:** clarification question, precision correction, transparent
   default, or defer
4. **User job**
5. **Decision the user is qualified to make**
6. **Why it materially changes architecture**
7. **Eligibility signals**
8. **Ineligibility and explicit-evidence bypasses**
9. **Priority relative to other policies**
10. **Exact user-facing question**
11. **Answer choices**, including **Not sure — use a sensible default**
12. **Per-answer capability and evidence effects**
13. **Per-answer tool-selection implications**
14. **URL/context field and edit behavior**
15. **Negative examples**
16. **Audit prompts**
17. **User-friction risk**
18. **Evidence required before lifecycle promotion**
19. **Known limitations and unresolved decisions**

For a non-question policy, mark the question, choices, and URL state as not
applicable rather than inventing them.

## 3. Decision ordering and friction contract

### Ask zero questions when

- explicit requirements or valid known context settle the decision;
- the ambiguity is a detector precision error;
- different answers would not materially change capabilities or tools;
- a transparent conservative default avoids unsupported infrastructure;
- the question would only confirm a generic implementation fact; or
- saved context is stale or inapplicable.

### Admit one question only when

- the unresolved decision belongs to the builder;
- at least two answers produce materially different capability or tool outcomes;
- eligibility and explicit-evidence bypasses are narrow and deterministic;
- an approved conservative default exists; and
- the likely harm of a silent wrong assumption outweighs the interruption.

### Allow a second question only when

The first answer has been applied, context has been sanitized, and eligibility
has been recomputed from scratch. A separate ambiguity must still qualify under
the one-question admission criteria, and representative journey evidence must
show that the additional interruption is worthwhile.

Never pre-queue questions. Ask one at a time and never more than two. Render the
Architecture Brief as soon as no justified question remains.

### Ordering

1. Apply explicit requirements and valid known context.
2. Neutralize stale context.
3. Correct known detector precision errors.
4. Re-evaluate question-policy eligibility.
5. Ask the highest-impact eligible policy.
6. Apply the answer and re-evaluate from scratch.
7. Render the Brief when no justified policy remains or the two-question ceiling
   is reached.

A system-applied assumption and a builder-selected sensible default are not the
same evidence. Keep their presentation and provenance distinct.

## 4. Completed policy: AI grounding

- **Policy ID:** `ai-grounding`
- **Lifecycle:** implemented
- **Treatment:** clarification question
- **User job:** project idea → architecture
- **Decision:** whether an AI product answers from its own sources, general
  model knowledge, or both
- **Architecture impact:** changes inferred Retrieval and Vector Storage
  requirements and their selected tools
- **Eligibility:** AI/LLM intent with unresolved source grounding
- **Bypasses:** direct Retrieval or Vector Storage evidence; source-grounding
  project-shape evidence; direct PDF or document grounding evidence
- **Priority:** currently the only implemented clarification policy
- **URL/context field:** `aiGrounding`; the answer is visible and editable through
  **Change**

**Question:**

> Will the product you’re building answer from its own documents or sources,
> general model knowledge, or both?

**Choices:**

- Use the product’s own sources
- Use general model knowledge
- Use both
- Not sure — use a sensible default

**Deterministic effects:**

| Answer | Capability and evidence effect | Tool implication |
|---|---|---|
| Product sources | Add or retain Retrieval with clarified evidence; remove inferred-only Vector Storage. Do not invent Document Parsing, Web Scraping, Database, or Vector Storage. | A Retrieval tool may be selected; a vector tool supported only by broad chatbot inference is removed. |
| General model knowledge | Remove inferred-only Retrieval and Vector Storage. Preserve explicit and shape-backed source requirements. | Tools serving only those removed assumptions disappear; the LLM tool remains. |
| Both | Add or retain Retrieval with clarified evidence; remove inferred-only Vector Storage. Do not invent a source type. | Same Retrieval/vector boundary as product sources. |
| Sensible default | Use the same conservative capability result as general model knowledge. | Do not select Retrieval/vector tools supported only by broad chatbot inference. |

A selected sensible default is visible, URL-backed, and editable. It does not
manufacture clarified evidence for a capability it removes. Clarified evidence
is added only when a builder answer introduces or retains a capability.

Ineligible stale `aiGrounding` state may remain in the raw URL but is removed
from effective visible and recommendation context. Explicit requirements remain
authoritative.

**Negative examples:**

- a non-AI marketplace prompt, including one with a stale grounding parameter;
- an explicit RAG or vector prompt;
- an AI Q&A product explicitly grounded in PDFs or documents; and
- a source-grounded research assistant recognized by project shape.

**Audit prompts:** the 14-prompt recommendation review fixture, explicit
RAG/vector/document prompts, minimal AI prompts, broad chatbot prompts, and stale
URL-state cases.

**User-friction risk:** the question interrupts every eligible unresolved AI
prompt, so its value must continue to be checked against representative journeys.

**Known limitations:** this is one authored policy, not generic ordering code.
There is no implemented second-question flow or persistence beyond URL context.
Eligibility depends on detector and project-shape evidence, general knowledge and
the sensible default currently produce the same capability result, and **both**
does not automatically require Vector Storage.

## 5. Candidate and deferred policies

### Customer-support communication channel

- **Lifecycle:** candidate
- **Treatment:** possible clarification question
- **User job:** project idea → architecture
- **Decision:** how customers and the support team exchange messages
- **Architecture impact:** an email channel may add Email; an in-product channel
  may require an operator surface and stored conversation state
- **Eligibility:** only a narrow, verified customer-support workflow with no
  stated communication channel
- **Bypasses:** explicit email, customer emails, support inbox, chat, or another
  stated channel
- **Priority:** for an AI support product, consider AI grounding first, then
  re-evaluate this policy from scratch
- **Question, choices, default, URL state, and exact effects:** not approved
- **Negative examples:** “support for dark mode,” “supports offline mode,” and
  language support
- **Lifecycle promotion blockers:** no approved sensible default, exact
  in-product capability contract, eligible prompt evidence, or evidence that a
  second question is worth the friction

Do not use this candidate to legitimize the bare `support → Email` detector
behavior. Non-domain support matches are precision issues, not user questions.

### Requests → Database

- **Lifecycle:** deferred
- **Treatment:** defer; contextual detector precision issue
- Pull requests, API requests, and persisted service requests do not form a
  stable user-answerable architecture decision.
- Question, choices, default, URL state, and promotion are not applicable.

### Track/tracking → Database

- **Lifecycle:** deferred
- **Treatment:** defer
- Tracking stored domain state and monitoring operational errors are different
  meanings with no stable user-answerable question contract.
- Question, choices, default, URL state, and promotion are not applicable.

### Data → Database

- **Lifecycle:** deferred
- **Treatment:** defer; broad detector inference
- The word “data” does not establish persistence or a user decision worth an
  interruption.
- Question, choices, default, URL state, and promotion are not applicable.

### Existing-product / missing-piece context

- **Lifecycle:** deferred to Phase 2
- **Treatment:** separate user mode, not an intake clarification policy
- The first version uses only current context described by the builder.
- Repository upload, GitHub connection, automatic inspection, persistence, and
  ingestion remain out of scope.

## 6. Promotion evidence gate

Before a candidate becomes an implemented question, require:

- demonstrated frequency and user harm;
- at least two exact, materially different capability and tool outcomes;
- narrow deterministic eligibility and negative examples;
- complete explicit-evidence bypasses;
- an approved conservative default;
- exact capability evidence, origin, and tool-selection behavior;
- stale URL-state handling;
- expected results across the review and detector audit corpora; and
- representative journey evidence that interruption is worth the friction.

Lifecycle promotion authorizes planning, not implementation. Any runtime change
still requires its own approved vertical and regression audit.
