import * as z from 'zod'

export const signInFormSchema = z.object({
  email: z.string().email({
    message: 'Enter a valid email',
  }),
  password: z.string().min(1, {
    message: 'Enter your password',
  }),
  rememberMe: z.boolean().optional(),
})

export type SignInData = z.infer<typeof signInFormSchema>
