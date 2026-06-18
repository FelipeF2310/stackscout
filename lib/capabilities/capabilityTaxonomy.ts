import type { Capability } from './capabilityTypes'

export const CAPABILITY_TAXONOMY: Capability[] = [
  {
    capability_id: 'auth',
    name: 'Authentication',
    description: 'User identity, login, session management, and access control',
    category: 'auth',
  },
  {
    capability_id: 'database',
    name: 'Database',
    description: 'Persistent structured data storage and querying',
    category: 'data',
  },
  {
    capability_id: 'vector-storage',
    name: 'Vector Storage',
    description: 'Embedding storage and similarity search for AI applications',
    category: 'data',
  },
  {
    capability_id: 'file-storage',
    name: 'File Storage',
    description: 'Blob and file storage for user uploads and assets',
    category: 'data',
  },
  {
    capability_id: 'deployment',
    name: 'Deployment',
    description: 'Hosting, CI/CD, and infrastructure for running applications',
    category: 'infrastructure',
  },
  {
    capability_id: 'scheduling',
    name: 'Scheduling',
    description: 'Background jobs, queues, cron tasks, and event-driven workflows',
    category: 'infrastructure',
  },
  {
    capability_id: 'monitoring',
    name: 'Monitoring',
    description: 'Error tracking, performance monitoring, and observability',
    category: 'observability',
  },
  {
    capability_id: 'agent-framework',
    name: 'Agent Framework',
    description: 'Orchestration layer for building AI agents and multi-step AI workflows',
    category: 'ai',
  },
  {
    capability_id: 'llm-api',
    name: 'LLM API',
    description: 'Access to large language models for generation, classification, and reasoning',
    category: 'ai',
  },
  {
    capability_id: 'retrieval',
    name: 'Retrieval',
    description: 'Semantic search and retrieval-augmented generation (RAG) pipelines',
    category: 'ai',
  },
  {
    capability_id: 'document-parsing',
    name: 'Document Parsing',
    description: 'Extracting structured content from PDFs, Word files, and other documents',
    category: 'ai',
  },
  {
    capability_id: 'email',
    name: 'Email',
    description: 'Transactional and marketing email delivery',
    category: 'communication',
  },
  {
    capability_id: 'payments',
    name: 'Payments',
    description: 'Payment processing, subscriptions, and billing',
    category: 'payments',
  },
  {
    capability_id: 'api-layer',
    name: 'API Layer',
    description: 'Server-side API routing and type-safe client-server communication',
    category: 'infrastructure',
  },
  {
    capability_id: 'frontend-framework',
    name: 'Frontend Framework',
    description: 'Web application framework for building user interfaces',
    category: 'frontend',
  },
  {
    capability_id: 'search',
    name: 'Search',
    description: 'Full-text search and faceted filtering for application content',
    category: 'data',
  },
]

export function getCapabilityById(id: string): Capability | undefined {
  return CAPABILITY_TAXONOMY.find((c) => c.capability_id === id)
}

export function getCapabilitiesByCategory(category: Capability['category']): Capability[] {
  return CAPABILITY_TAXONOMY.filter((c) => c.category === category)
}
