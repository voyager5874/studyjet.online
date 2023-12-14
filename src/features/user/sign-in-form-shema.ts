import * as z from 'zod'

export const LoginFormSchema = z.object({
  email: z.string().email({
    message: 'Enter a valid email',
  }),
  password: z.string().min(1, {
    message: 'Enter your password',
  }),
  rememberMe: z.boolean().optional(),
})

export type LoginParameters = z.infer<typeof LoginFormSchema>
