# StackScout — Domain Context

## What StackScout does

StackScout helps builders discover the right architecture and open-source tools for what they want to build. Users describe a project in plain English. StackScout detects required capabilities, recommends compatible tools, explains tradeoffs, and generates an architecture.

## Core terminology

### Capability
A system requirement expressed as a named function — what the system needs to do, not how.

Examples: Authentication, Vector Storage, Document Parsing, Scheduling.

Capabilities are canonical. They live in the taxonomy. They are not invented per-project.

### Tool
A piece of software (typically a library, SaaS, or open-source project) that fulfills a capability.

A tool is linked to one or more capabilities. Tools are not capabilities.

Clerk is a tool. Authentication is a capability. Clerk fulfills Authentication.

### Architecture
A collection of capabilities fulfilled by compatible, selected tools — together with a rationale explaining why they fit for a specific project.

### Relationship
A typed, directional connection between two tools. Relationships power compatibility scoring and alternative surfacing.

### Architecture Outcome
A user-reported signal, collected 14 days after an architecture is saved, indicating whether the recommendation remained useful.

## The primary design principle

**Capabilities are first-class. Tools are not.**

Features are designed around capability detection and selection. Tools appear as implementations of capabilities. This distinction governs every data model, UI, and recommendation decision.

## Phase 1 scope

The MVP is a manually curated corpus of 50–100 tools, covering the most common capabilities for AI-assisted builders.

See `docs/MVP_SCOPE.md` for the full scope boundary.

## Users

Primary: AI-assisted builders using tools like Claude Code, Cursor, Lovable, v0, Replit.

They can implement quickly. They need help deciding what to build with.
