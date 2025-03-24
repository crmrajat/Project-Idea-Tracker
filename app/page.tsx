import { ProjectIdeaTracker } from "@/components/project-idea-tracker"

export default function Home() {
  return (
    <main className="container py-10 mx-auto max-w-7xl">
      <div className="text-center mb-10 space-y-2">
        <h1 className="text-3xl font-bold">Project Idea Tracker</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Keep track of your project ideas, set priorities, categorize them, and manage their status. Never lose a
          brilliant idea again!
        </p>
      </div>
      <ProjectIdeaTracker />
    </main>
  )
}

