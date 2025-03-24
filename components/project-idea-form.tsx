"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import type { ProjectIdea } from "./project-idea-tracker"
import { projectIdeaSchema, type ProjectIdeaFormValues } from "@/lib/validations"

interface ProjectIdeaFormProps {
  onSubmit: (idea: Omit<ProjectIdea, "id" | "createdAt">) => void
  onCancel: () => void
  initialData?: Omit<ProjectIdea, "id" | "createdAt">
  categories: string[]
  autoFocus?: boolean
}

export function ProjectIdeaForm({
  onSubmit,
  onCancel,
  initialData,
  categories,
  autoFocus = false,
}: ProjectIdeaFormProps) {
  const [newCategory, setNewCategory] = useState("")
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false)
  const titleInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<ProjectIdeaFormValues>({
    resolver: zodResolver(projectIdeaSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      priority: initialData?.priority || "Medium",
      category: initialData?.category || "",
      status: initialData?.status || "Pending",
      notes: initialData?.notes || "",
    },
    mode: "onSubmit",
  })

  // Set focus on the title input when the form is opened
  useEffect(() => {
    if (autoFocus && titleInputRef.current) {
      titleInputRef.current?.focus()
    }
  }, [autoFocus])

  const handleFormSubmit = useCallback(
    (values: ProjectIdeaFormValues) => {
      let finalCategory = values.category
      if (showNewCategoryInput && newCategory.trim()) {
        finalCategory = newCategory.trim()
      }

      const submissionData = {
        ...values,
        category: finalCategory,
      }

      onSubmit(submissionData)
    },
    [newCategory, onSubmit, showNewCategoryInput],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey && !(e.target as HTMLElement).classList.contains("textarea")) {
        e.preventDefault()
        form.handleSubmit(handleFormSubmit)()
      }
    },
    [form, handleFormSubmit],
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} onKeyDown={handleKeyDown} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter project title"
                    maxLength={100}
                    {...field}
                    ref={titleInputRef}
                    aria-required="true"
                  />
                </FormControl>
                <FormDescription className="sr-only">Enter a title for your project idea</FormDescription>
                <FormMessage />
                <p className="text-xs text-muted-foreground text-right">{field.value?.length || 0}/100</p>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription className="sr-only">Select the priority level for this project</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your project idea"
                  rows={3}
                  maxLength={500}
                  {...field}
                  className="resize-y min-h-[80px]"
                />
              </FormControl>
              <FormDescription className="sr-only">Provide a detailed description of your project idea</FormDescription>
              <FormMessage />
              <p className="text-xs text-muted-foreground text-right">{field.value?.length || 0}/500</p>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category *</FormLabel>
                {!showNewCategoryInput ? (
                  <Select
                    onValueChange={(value) => {
                      if (value === "new") {
                        setShowNewCategoryInput(true)
                      } else {
                        field.onChange(value)
                      }
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories
                        .filter((category) => category.trim() !== "") // Filter out empty strings
                        .map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      <SelectItem value="new">+ Add new category</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex space-x-2">
                    <Input
                      value={newCategory}
                      onChange={(e) => {
                        setNewCategory(e.target.value)
                        field.onChange(e.target.value)
                      }}
                      placeholder="Enter new category"
                      aria-label="New category name"
                      aria-required="true"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowNewCategoryInput(false)}
                      aria-label="Cancel adding new category"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
                <FormDescription className="sr-only">Choose or create a category for your project</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription className="sr-only">Select the current status of your project</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional notes or comments"
                  rows={3}
                  maxLength={300}
                  {...field}
                  className="resize-y min-h-[80px]"
                />
              </FormControl>
              <FormDescription className="sr-only">
                Add any additional notes or comments about your project
              </FormDescription>
              <FormMessage />
              <p className="text-xs text-muted-foreground text-right">{field.value?.length || 0}/300</p>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="transition-colors hover:bg-muted focus:ring-2 focus:ring-muted focus:ring-offset-2"
            aria-label="Cancel form submission"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="transition-colors hover:bg-primary/90 focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
            aria-label="Save project idea"
          >
            Save Idea
          </Button>
        </div>
      </form>
    </Form>
  )
}

