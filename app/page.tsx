import ProjectPrompt from '@/components/prompt/ProjectPrompt'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl w-full space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">StackScout</h1>
          <p className="text-muted-foreground text-lg">
            Describe what you&apos;re building. Get the architecture you need.
          </p>
        </div>
        <ProjectPrompt />
      </div>
    </main>
  )
}
