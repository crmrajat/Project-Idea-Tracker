"use client"

import type React from "react"
import { useCallback } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, X, Filter } from "lucide-react"

interface ProjectIdeaFiltersProps {
  filters: {
    priority: string
    category: string
    status: string
    searchTerm: string
  }
  setFilters: React.Dispatch<
    React.SetStateAction<{
      priority: string
      category: string
      status: string
      searchTerm: string
    }>
  >
  categories: string[]
}

export function ProjectIdeaFilters({ filters, setFilters, categories }: ProjectIdeaFiltersProps) {
  const handleFilterChange = useCallback(
    (name: string, value: string) => {
      setFilters((prev) => ({ ...prev, [name]: value === "all" ? "" : value }))
    },
    [setFilters],
  )

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))
    },
    [setFilters],
  )

  const resetFilters = useCallback(() => {
    setFilters({
      priority: "",
      category: "",
      status: "",
      searchTerm: "",
    })
  }, [setFilters])

  const hasActiveFilters =
    filters.priority !== "" || filters.category !== "" || filters.status !== "" || filters.searchTerm !== ""

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      // Search is already handled by onChange
    }
  }, [])

  return (
    <div className="bg-card border rounded-lg p-4 space-y-4 transition-all hover:shadow-sm">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-lg font-medium flex items-center">
          <Filter className="mr-2 h-4 w-4" aria-hidden="true" />
          Filters
        </h3>
        <div className="h-8">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="transition-all hover:bg-muted focus:ring-2 focus:ring-muted focus:ring-offset-1"
              aria-label="Clear all filters"
            >
              <X className="mr-2 h-4 w-4" />
              Clear filters
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="search"
              placeholder="Search ideas..."
              className="pl-8 h-10 transition-all focus:border-primary focus:ring-1 focus:ring-primary"
              value={filters.searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              aria-label="Search project ideas"
            />
            {filters.searchTerm && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-7 w-7 p-0"
                onClick={() => setFilters((prev) => ({ ...prev, searchTerm: "" }))}
                aria-label="Clear search"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority-filter">Priority</Label>
          <Select
            value={filters.priority}
            onValueChange={(value) => handleFilterChange("priority", value)}
            aria-label="Filter by priority"
          >
            <SelectTrigger id="priority-filter" className="h-10">
              <SelectValue placeholder="All priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category-filter">Category</Label>
          <Select
            value={filters.category}
            onValueChange={(value) => handleFilterChange("category", value)}
            aria-label="Filter by category"
          >
            <SelectTrigger id="category-filter" className="h-10">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories
                .filter((category) => category.trim() !== "") // Filter out empty strings
                .map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status-filter">Status</Label>
          <Select
            value={filters.status}
            onValueChange={(value) => handleFilterChange("status", value)}
            aria-label="Filter by status"
          >
            <SelectTrigger id="status-filter" className="h-10">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

