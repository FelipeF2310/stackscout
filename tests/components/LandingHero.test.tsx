import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

// LandingHero is a client component: stub the Next router + Link so it renders
// to static markup. We assert the canonical landing structure and the locked
// decisions (send disabled when empty, deferred "Guide me" marker, real Saved
// link), not interactive behavior.
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }))
vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}))

import LandingHero, { workspaceUrl } from '../../components/landing/LandingHero'

function render(node: React.ReactElement): string {
  vi.stubGlobal('React', React)
  try {
    return renderToStaticMarkup(node)
  } finally {
    vi.unstubAllGlobals()
  }
}

describe('LandingHero', () => {
  it('renders the canonical lede and the focused prompt field', () => {
    const html = render(<LandingHero />)
    expect(html).toContain('What are you building?')
    expect(html).toContain('StackScout figures out the capabilities')
    expect(html).toContain('<textarea')
    expect(html).toContain('A chatbot that answers questions over our internal PDFs') // placeholder
  })

  it('disables submit when the field is empty', () => {
    const html = render(<LandingHero />)
    expect(html).toMatch(/<button[^>]*disabled/) // send button starts disabled
  })

  it('renders the three canonical starter cards', () => {
    const html = render(<LandingHero />)
    expect(html).toContain('Chat over your documents')
    expect(html).toContain('Marketplace with payments')
    expect(html).toContain('Realtime collaboration')
  })

  it('renders only the real Saved nav link', () => {
    const html = render(<LandingHero />)
    expect(html).toContain('href="/saved"')
    expect(html).not.toContain('Capabilities') // no fake nav route
  })

  it('shows a non-interactive Architecture Mode marker, not a working toggle', () => {
    const html = render(<LandingHero />)
    expect(html).toContain('Architecture Mode')
    // No working mode toggle on the landing, and no "coming soon" future-feature copy.
    expect(html).not.toContain('Just show a stack')
    expect(html).not.toContain('coming soon')
  })

  it('renders the footer hint', () => {
    const html = render(<LandingHero />)
    expect(html).toContain('Capability-first')
    expect(html).toContain('the best')
  })

  it('submits into the canonical workspace, not the old /?q= path', () => {
    const url = workspaceUrl('Build a PDF chatbot for internal company documents')
    expect(url).toBe('/workspace?idea=Build%20a%20PDF%20chatbot%20for%20internal%20company%20documents')
    expect(url.startsWith('/workspace?idea=')).toBe(true)
    expect(url).not.toContain('/?q=')
  })
})
