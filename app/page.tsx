import { ProjectIdeaTracker } from "@/components/project-idea-tracker"

export default function Home() {
  return (
    <main className="container py-10 px-4 sm:px-6 mx-auto max-w-7xl">
      <div className="text-center mb-12 space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">Project Idea Tracker</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Keep track of your project ideas, set priorities, categorize them, and manage their status. Never lose a
          brilliant idea again!
        </p>
      </div>
      <ProjectIdeaTracker />
    </main>
  )
}

