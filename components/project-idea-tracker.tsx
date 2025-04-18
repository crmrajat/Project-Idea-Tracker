"use client"

import { useState, useCallback } from "react"
import { ProjectIdeaForm } from "./project-idea-form"
import { ProjectIdeaList } from "./project-idea-list"
import { ProjectIdeaFilters } from "./project-idea-filters"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useSonnerToast } from "@/hooks/use-sonner-toast"
import { ScrollArea } from "@/components/ui/scroll-area"

export type ProjectIdea = {
  id: string
  title: string
  description: string
  priority: "Low" | "Medium" | "High"
  category: string
  status: "Pending" | "Active" | "Completed"
  notes: string
  createdAt: Date
}

export function ProjectIdeaTracker() {
  const [ideas, setIdeas] = useState<ProjectIdea[]>([
    {
      id: "1",
      title: "E-commerce Platform",
      description: "Build an online store with payment processing",
      priority: "High",
      category: "Web Development",
      status: "Active",
      notes: "Need to research payment gateways",
      createdAt: new Date(2023, 5, 15),
    },
    {
      id: "2",
      title: "Mobile Fitness App",
      description: "Create a workout tracking application",
      priority: "Medium",
      category: "Mobile App",
      status: "Pending",
      notes: "Research competitor apps first",
      createdAt: new Date(2023, 6, 22),
    },
    {
      id: "3",
      title: "Data Visualization Dashboard",
      description: "Dashboard for company metrics",
      priority: "Low",
      category: "Data Science",
      status: "Completed",
      notes: "Used D3.js for charts",
      createdAt: new Date(2023, 4, 10),
    },
  ])

  const { success, error, undo } = useSonnerToast()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [filters, setFilters] = useState({
    priority: "",
    category: "",
    status: "",
    searchTerm: "",
  })

  const addIdea = useCallback(
    (idea: Omit<ProjectIdea, "id" | "createdAt">) => {
      const newIdea: ProjectIdea = {
        ...idea,
        id: Date.now().toString(),
        createdAt: new Date(),
      }
      setIdeas((prev) => [...prev, newIdea])
      setIsAddDialogOpen(false)
      success({
        title: "Idea Added",
        description: `"${idea.title}" has been added successfully`,
      })
    },
    [success],
  )

  const updateIdea = useCallback(
    (updatedIdea: ProjectIdea) => {
      setIdeas((prev) => prev.map((idea) => (idea.id === updatedIdea.id ? updatedIdea : idea)))
      success({
        title: "Idea Updated",
        description: `"${updatedIdea.title}" has been updated successfully`,
      })
    },
    [success],
  )

  const deleteIdea = useCallback(
    (id: string) => {
      // Find the idea to delete before removing it
      const deletedIdea = ideas.find((idea) => idea.id === id)

      if (!deletedIdea) return

      // Update the state immediately to remove the idea
      setIdeas((prevIdeas) => prevIdeas.filter((idea) => idea.id !== id))

      // Show toast with undo option
      undo({
        title: "Idea Deleted",
        description: `"${deletedIdea.title}" has been deleted`,
        onUndo: () => {
          // Restore the deleted idea
          setIdeas((prev) => [...prev, deletedIdea])

          // Show a brief confirmation toast
          success({
            title: "Idea Restored",
            description: `"${deletedIdea.title}" has been restored`,
            duration: 2000, // 2 seconds
          })
        },
      })
    },
    [ideas, undo, success],
  )

  const filteredIdeas = ideas.filter((idea) => {
    return (
      (filters.priority === "" || idea.priority === filters.priority) &&
      (filters.category === "" || idea.category === filters.category) &&
      (filters.status === "" || idea.status === filters.status) &&
      (filters.searchTerm === "" ||
        idea.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        idea.description.toLowerCase().includes(filters.searchTerm.toLowerCase()))
    )
  })

  const categories = Array.from(
    new Set(ideas.map((idea) => idea.category).filter((category) => category && category.trim() !== "")),
  )

  const hasActiveFilters =
    filters.priority !== "" || filters.category !== "" || filters.status !== "" || filters.searchTerm !== ""

  const resetFilters = useCallback(() => {
    setFilters({
      priority: "",
      category: "",
      status: "",
      searchTerm: "",
    })
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold">Your Project Ideas</h2>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="w-full sm:w-auto transition-colors hover:bg-primary/90 focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
          aria-label="Add new project idea"
        >
          <PlusCircle className="mr-2 h-4 w-4" aria-hidden="true" />
          <span>Add New Idea</span>
        </Button>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Add New Project Idea</DialogTitle>
            <DialogDescription>Create a new project idea with details and categorization.</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(80vh-120px)]">
            <div className="p-1">
              <ProjectIdeaForm
                onSubmit={addIdea}
                categories={categories}
                onCancel={() => setIsAddDialogOpen(false)}
                autoFocus={true}
              />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <ProjectIdeaFilters filters={filters} setFilters={setFilters} categories={categories} />

      <ProjectIdeaList
        ideas={filteredIdeas}
        onUpdate={updateIdea}
        onDelete={deleteIdea}
        categories={categories}
        hasActiveFilters={hasActiveFilters}
        resetFilters={resetFilters}
        totalIdeas={ideas.length}
      />
    </div>
  )
}

