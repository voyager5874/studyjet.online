import * as z from 'zod'

export const requestResetPasswordFormSchema = z.object({
  email: z.string().email({
    message: 'Enter a valid email',
  }),
})

export type RequestResetPasswordFormSchemaData = z.infer<typeof requestResetPasswordFormSchema>
