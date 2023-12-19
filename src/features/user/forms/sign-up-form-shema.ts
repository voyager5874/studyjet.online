import * as z from 'zod'

export const signUpFormSchema = z
  .object({
    email: z.string().email({
      message: 'Enter a valid email',
    }),
    password: z.string().min(6, {
      message: 'Enter your password',
    }),
    repeatPassword: z.string().min(1, {
      message: 'please repeat you password',
    }),
  })
  .refine(data => data.password === data.repeatPassword, {
    path: ['repeatPassword'],
    message: 'passwords do not match',
  })

export type SignUpData = z.infer<typeof signUpFormSchema>
