"use client"

import { useState, useCallback } from "react"
import type { ProjectIdea } from "./project-idea-tracker"
import { ProjectIdeaForm } from "./project-idea-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, ClipboardList, Calendar } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

// Format date consistently
const formatDate = (date: Date) => {
  const d = new Date(date)
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
  return new Intl.DateTimeFormat("en-US", options).format(d)
}

interface ProjectIdeaListProps {
  ideas: ProjectIdea[]
  onUpdate: (idea: ProjectIdea) => void
  onDelete: (id: string) => void
  categories: string[]
}

export function ProjectIdeaList({ ideas, onUpdate, onDelete, categories }: ProjectIdeaListProps) {
  const [editingIdea, setEditingIdea] = useState<ProjectIdea | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [viewingIdea, setViewingIdea] = useState<ProjectIdea | null>(null)

  const handleEdit = useCallback((idea: ProjectIdea) => {
    setEditingIdea(idea)
  }, [])

  const handleUpdate = useCallback(
    (updatedData: Omit<ProjectIdea, "id" | "createdAt">) => {
      if (editingIdea) {
        onUpdate({
          ...updatedData,
          id: editingIdea.id,
          createdAt: editingIdea.createdAt,
        })
        setEditingIdea(null)
      }
    },
    [editingIdea, onUpdate],
  )

  const handleDelete = useCallback(() => {
    if (deleteConfirmId) {
      onDelete(deleteConfirmId)
      setDeleteConfirmId(null)
    }
  }, [deleteConfirmId, onDelete])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Pending":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getPriorityDot = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500"
      case "Medium":
        return "bg-yellow-500"
      case "Low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusDot = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-blue-500"
      case "Completed":
        return "bg-green-500"
      case "Pending":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  if (ideas.length === 0) {
    return (
      <div className="text-center py-16 px-4 border rounded-lg bg-card">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="bg-muted rounded-full p-4">
            <ClipboardList className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-semibold">No project ideas found</h3>
          <p className="text-muted-foreground max-w-md">
            You haven't added any project ideas yet. Click the "Add New Idea" button to get started.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {ideas.map((idea) => (
        <Card
          key={idea.id}
          className="flex flex-col h-auto min-h-[320px] transition-all duration-200 hover:shadow-md hover:border-primary/50 focus-within:ring-2 focus-within:ring-primary/50 focus-within:ring-offset-2 overflow-hidden cursor-pointer"
          tabIndex={0}
          onClick={() => setViewingIdea(idea)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              setViewingIdea(idea)
            }
          }}
        >
          <CardHeader className="pb-2 relative">
            <div className="flex justify-between items-start">
              <div className="overflow-hidden pr-16">
                <CardTitle className="text-lg truncate" title={idea.title}>
                  {idea.title}
                </CardTitle>
                <CardDescription className="mt-1">Created on {formatDate(idea.createdAt)}</CardDescription>
              </div>
              <div className="absolute top-4 right-4 flex space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0 hover:bg-muted transition-colors rounded-full"
                  aria-label={`Edit ${idea.title}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEdit(idea)
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0 hover:bg-red-100 hover:text-red-600 transition-colors rounded-full"
                  aria-label={`Delete ${idea.title}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    setDeleteConfirmId(idea.id)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden">
            <div className="mb-2">
              <p className="text-sm text-muted-foreground line-clamp-3 overflow-ellipsis">
                {idea.description || "No description provided"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="outline" className={getPriorityColor(idea.priority)}>
                {idea.priority} Priority
              </Badge>
              <Badge variant="outline" className={getStatusColor(idea.status)}>
                {idea.status}
              </Badge>
            </div>
            {idea.category && (
              <Badge
                variant="outline"
                className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
              >
                {idea.category}
              </Badge>
            )}
          </CardContent>
          <CardFooter className="border-t pt-4">
            <div className="w-full overflow-hidden">
              <h4 className="text-sm font-medium mb-1">Notes:</h4>
              <p className="text-sm text-muted-foreground line-clamp-2 overflow-ellipsis">
                {idea.notes || "No notes added"}
              </p>
            </div>
          </CardFooter>
        </Card>
      ))}

      <Dialog open={!!editingIdea} onOpenChange={(open) => !open && setEditingIdea(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Edit Project Idea</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(80vh-120px)]">
            <div className="p-1">
              {editingIdea && (
                <ProjectIdeaForm
                  onSubmit={handleUpdate}
                  onCancel={() => setEditingIdea(null)}
                  initialData={{
                    title: editingIdea.title,
                    description: editingIdea.description,
                    priority: editingIdea.priority,
                    category: editingIdea.category,
                    status: editingIdea.status,
                    notes: editingIdea.notes,
                  }}
                  categories={categories}
                  autoFocus={true}
                />
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project idea.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 focus:ring-red-500">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!viewingIdea} onOpenChange={(open) => !open && setViewingIdea(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden p-0 gap-0">
          {viewingIdea && (
            <>
              <div className="p-6 pb-0">
                <div className="flex items-center">
                  <h2 className="text-2xl font-semibold tracking-tight">{viewingIdea.title}</h2>
                </div>

                <div className="flex items-center mt-2 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  Created on {formatDate(viewingIdea.createdAt)}
                </div>
              </div>

              <ScrollArea className="max-h-[calc(80vh-120px)] px-6">
                <div className="py-4 space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                      Description
                    </h3>
                    <p className="text-base leading-relaxed">{viewingIdea.description || "No description provided"}</p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                        Details
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full ${getPriorityDot(viewingIdea.priority)} mr-2`} />
                          <span className="font-medium mr-2">Priority:</span>
                          <span className="text-muted-foreground">{viewingIdea.priority}</span>
                        </div>

                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full ${getStatusDot(viewingIdea.status)} mr-2`} />
                          <span className="font-medium mr-2">Status:</span>
                          <span className="text-muted-foreground">{viewingIdea.status}</span>
                        </div>

                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-purple-500 mr-2" />
                          <span className="font-medium mr-2">Category:</span>
                          <span className="text-muted-foreground">{viewingIdea.category || "Uncategorized"}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Notes</h3>
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {viewingIdea.notes || "No notes added"}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className={getPriorityColor(viewingIdea.priority)}>
                        {viewingIdea.priority} Priority
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(viewingIdea.status)}>
                        {viewingIdea.status}
                      </Badge>
                      {viewingIdea.category && (
                        <Badge
                          variant="outline"
                          className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                        >
                          {viewingIdea.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

