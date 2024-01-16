import * as z from 'zod'

export const learnDeckFormSchema = z.object({
  grade: z.enum(['', '1', '2', '3', '4', '5']).refine(grade => {
    const value = Number.parseInt(grade)

    if (Number.isInteger(value)) {
      return true
    }
  }),
})

export type LearnDeckFormData = z.infer<typeof learnDeckFormSchema>
