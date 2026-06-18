# Product Principles

These govern every feature and UX decision in StackScout.

---

## 1. Explain decisions, not just tools

Every recommendation must answer:
- Why this tool?
- Why not the alternatives?
- What tradeoffs am I accepting?
- Under what circumstances would I choose something else?

Never surface a tool name without explanation.

---

## 2. Architecture matters more than repository discovery

Users care about building systems, not browsing repositories.

Do not design features that feel like "GitHub search with AI."
Design features that help users understand system design.

---

## 3. Compatibility matters more than popularity

The best architecture is not necessarily the most popular one.

GitHub stars, npm downloads, and trending lists are weak signals.
Compatibility with the user's other selected tools is a strong signal.

---

## 4. Recommendations must adapt to context

Project constraints shape recommendations:
- Skill level (beginner / intermediate / advanced)
- Project stage (prototype / production / enterprise)
- Hosting preference (managed / self-hosted)
- Ecosystem (TypeScript / Python / Mixed)
- Model preference (OpenAI / Anthropic / Open Source)

A recommendation that ignores context is a generic recommendation.
Generic recommendations erode trust.

---

## 5. Confidence is not the same as correctness

User trust must be validated through long-term outcomes.

Never use language like "this is the best choice" or "guaranteed to work."
Use language like "recommended for your context" or "commonly used with."

---

## 6. Recommendations should serve both technical and non-technical users

The explanation layer must support two depths:
- **Simple**: one sentence, no jargon
- **Technical**: full tradeoff analysis

Default to simple. Let users opt into technical depth.

---

## 7. Relationship intelligence is a strategic asset

The value is not knowing tools. The value is understanding how they fit together.

Invest in relationship data: compatibility, alternatives, common pairings.
This is the moat, not the tool list.
