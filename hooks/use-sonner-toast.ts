"use client"

import { toast } from "sonner"
import { Undo2 } from "lucide-react"

type ToastOptions = {
  title?: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export function useSonnerToast() {
  const showToast = ({ title, description, duration = 5000, action }: ToastOptions) => {
    return toast(title, {
      description,
      duration,
      action: action
        ? {
            label: action.label,
            onClick: action.onClick,
          }
        : undefined,
    })
  }

  const showSuccessToast = ({ title, description, duration = 3000, action }: ToastOptions) => {
    return toast.success(title, {
      description,
      duration,
      action: action
        ? {
            label: action.label,
            onClick: action.onClick,
          }
        : undefined,
    })
  }

  const showErrorToast = ({ title, description, duration = 5000, action }: ToastOptions) => {
    return toast.error(title, {
      description,
      duration,
      action: action
        ? {
            label: action.label,
            onClick: action.onClick,
          }
        : undefined,
    })
  }

  const showUndoToast = ({ title, description, onUndo, duration = 5000 }: ToastOptions & { onUndo: () => void }) => {
    return toast.error(title, {
      description,
      duration,
      action: {
        label: "Undo",
        onClick: onUndo,
      },
      icon: <Undo2 className="h-4 w-4" />,
    })
  }

  return {
    toast: showToast,
    success: showSuccessToast,
    error: showErrorToast,
    undo: showUndoToast,
    dismiss: toast.dismiss,
  }
}

