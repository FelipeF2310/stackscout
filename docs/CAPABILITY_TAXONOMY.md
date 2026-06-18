# Capability Taxonomy

The canonical list of system capabilities StackScout supports.

## Auth

| ID | Name | Description |
|---|---|---|
| `auth` | Authentication | User identity, login, session management, and access control |

## Data

| ID | Name | Description |
|---|---|---|
| `database` | Database | Persistent structured data storage and querying |
| `vector-storage` | Vector Storage | Embedding storage and similarity search for AI applications |
| `file-storage` | File Storage | Blob and file storage for user uploads and assets |
| `search` | Search | Full-text search and faceted filtering for application content |

## AI

| ID | Name | Description |
|---|---|---|
| `agent-framework` | Agent Framework | Orchestration layer for building AI agents and multi-step AI workflows |
| `llm-api` | LLM API | Access to large language models for generation, classification, and reasoning |
| `retrieval` | Retrieval | Semantic search and retrieval-augmented generation (RAG) pipelines |
| `document-parsing` | Document Parsing | Extracting structured content from PDFs, Word files, and other documents |

## Infrastructure

| ID | Name | Description |
|---|---|---|
| `deployment` | Deployment | Hosting, CI/CD, and infrastructure for running applications |
| `scheduling` | Scheduling | Background jobs, queues, cron tasks, and event-driven workflows |
| `api-layer` | API Layer | Server-side API routing and type-safe client-server communication |

## Frontend

| ID | Name | Description |
|---|---|---|
| `frontend-framework` | Frontend Framework | Web application framework for building user interfaces |

## Observability

| ID | Name | Description |
|---|---|---|
| `monitoring` | Monitoring | Error tracking, performance monitoring, and observability |

## Communication

| ID | Name | Description |
|---|---|---|
| `email` | Email | Transactional and marketing email delivery |

## Payments

| ID | Name | Description |
|---|---|---|
| `payments` | Payments | Payment processing, subscriptions, and billing |

---

## Adding a capability

Before adding a new capability:

1. Verify it doesn't overlap with an existing capability
2. Confirm it is a system requirement, not a specific tool
3. Update: this file, `lib/capabilities/capabilityTaxonomy.ts`, `data/seed/capabilities.json`
4. Add ≥1 tool linked to the new capability to `data/seed/tools.json`
