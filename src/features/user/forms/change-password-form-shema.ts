import * as z from 'zod'

export const changePasswordFormSchema = z
  .object({
    password: z.string().min(6, {
      message: 'your password is too short',
    }),
    repeatPassword: z.string().min(6, {
      message: 'please repeat you password',
    }),
  })
  .refine(data => data.password === data.repeatPassword, {
    path: ['repeatPassword'],
    message: 'passwords do not match',
  })

export type ChangePasswordData = z.infer<typeof changePasswordFormSchema>
