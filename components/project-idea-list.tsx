"use client"

import { useState, useCallback } from "react"
import type { ProjectIdea } from "./project-idea-tracker"
import { ProjectIdeaForm } from "./project-idea-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Edit, Eye, MoreVertical, Trash2, ClipboardList } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {ideas.map((idea) => (
        <Card
          key={idea.id}
          className="flex flex-col h-[320px] transition-all duration-200 hover:shadow-md hover:border-primary/50 focus-within:ring-2 focus-within:ring-primary/50 focus-within:ring-offset-2 overflow-hidden"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setViewingIdea(idea)
            }
          }}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="overflow-hidden">
                <CardTitle className="text-lg truncate" title={idea.title}>
                  {idea.title}
                </CardTitle>
                <CardDescription className="mt-1">
                  Created on {new Date(idea.createdAt).toLocaleDateString()}
                </CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0 hover:bg-muted transition-colors"
                    aria-label="Open menu for this project idea"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setViewingIdea(idea)} className="cursor-pointer focus:bg-muted">
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleEdit(idea)} className="cursor-pointer focus:bg-muted">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setDeleteConfirmId(idea.id)}
                    className="text-red-600 focus:text-red-600 cursor-pointer focus:bg-red-50"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Project Idea</DialogTitle>
            <DialogDescription>Make changes to your project idea details.</DialogDescription>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">{viewingIdea?.title}</DialogTitle>
            <DialogDescription>
              Created on {viewingIdea && new Date(viewingIdea.createdAt).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(80vh-120px)]">
            <div className="space-y-6 py-4 px-1">
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="h-4 w-1 bg-primary rounded-full mr-2"></div>
                  <h3 className="text-sm font-medium">Description</h3>
                </div>
                <div className="bg-card border rounded-lg p-4 shadow-sm transition-all hover:shadow-md">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {viewingIdea?.description || "No description provided"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="h-4 w-1 bg-primary rounded-full mr-2"></div>
                  <h3 className="text-sm font-medium">Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-card border rounded-lg p-4 shadow-sm transition-all hover:shadow-md flex items-center space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full ${viewingIdea?.priority === "High" ? "bg-red-500" : viewingIdea?.priority === "Medium" ? "bg-yellow-500" : "bg-green-500"}`}
                      aria-hidden="true"
                    ></div>
                    <span className="text-sm font-medium">Priority:</span>
                    <span className="text-sm text-muted-foreground">{viewingIdea?.priority}</span>
                  </div>
                  <div className="bg-card border rounded-lg p-4 shadow-sm transition-all hover:shadow-md flex items-center space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full ${viewingIdea?.status === "Active" ? "bg-blue-500" : viewingIdea?.status === "Completed" ? "bg-green-500" : "bg-orange-500"}`}
                      aria-hidden="true"
                    ></div>
                    <span className="text-sm font-medium">Status:</span>
                    <span className="text-sm text-muted-foreground">{viewingIdea?.status}</span>
                  </div>
                  <div className="bg-card border rounded-lg p-4 shadow-sm transition-all hover:shadow-md flex items-center space-x-3 col-span-full">
                    <div className="w-2 h-2 rounded-full bg-purple-500" aria-hidden="true"></div>
                    <span className="text-sm font-medium">Category:</span>
                    <span className="text-sm text-muted-foreground">{viewingIdea?.category || "Uncategorized"}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="h-4 w-1 bg-primary rounded-full mr-2"></div>
                  <h3 className="text-sm font-medium">Notes</h3>
                </div>
                <div className="bg-card border rounded-lg p-4 shadow-sm transition-all hover:shadow-md">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {viewingIdea?.notes || "No notes added"}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <div className="text-xs text-muted-foreground mb-2 font-medium">Tags</div>
                <div className="flex flex-wrap gap-2">
                  {viewingIdea && (
                    <>
                      <Badge
                        variant="outline"
                        className={`${getPriorityColor(viewingIdea.priority)} shadow-sm transition-all hover:shadow-md`}
                      >
                        {viewingIdea.priority} Priority
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`${getStatusColor(viewingIdea.status)} shadow-sm transition-all hover:shadow-md`}
                      >
                        {viewingIdea.status}
                      </Badge>
                      {viewingIdea.category && (
                        <Badge
                          variant="outline"
                          className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 shadow-sm transition-all hover:shadow-md"
                        >
                          {viewingIdea.category}
                        </Badge>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              className="transition-all hover:bg-muted"
              onClick={() => {
                if (viewingIdea) {
                  setViewingIdea(null)
                  handleEdit(viewingIdea)
                }
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button
              className="transition-all hover:bg-primary/90 focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
              onClick={() => setViewingIdea(null)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

