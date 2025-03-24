import * as z from "zod"

export const projectIdeaSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(100, { message: "Title must be less than 100 characters" })
    .refine((val) => val.trim().length > 0, {
      message: "Title cannot be empty",
    }),
  description: z
    .string()
    .max(500, { message: "Description must be less than 500 characters" })
    .optional()
    .or(z.literal("")),
  priority: z.enum(["Low", "Medium", "High"], {
    required_error: "Please select a priority level",
  }),
  category: z
    .string()
    .min(1, { message: "Category is required" })
    .refine((val) => val.trim().length > 0, {
      message: "Category cannot be empty",
    }),
  status: z.enum(["Pending", "Active", "Completed"], {
    required_error: "Please select a status",
  }),
  notes: z.string().max(300, { message: "Notes must be less than 300 characters" }).optional().or(z.literal("")),
})

export type ProjectIdeaFormValues = z.infer<typeof projectIdeaSchema>

