import * as z from 'zod'

export const changePasswordFormSchema = z
  .object({
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

export type ChangePasswordData = z.infer<typeof changePasswordFormSchema>
