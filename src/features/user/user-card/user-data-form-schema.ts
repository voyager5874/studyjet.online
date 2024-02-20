import { MAX_IMAGE_SIZE_BYTES } from '@/common/app-settings'
import { IMAGE_WAS_ERASED } from '@/common/const/function-arguments'
import { getFileFromUrl } from '@/utils'
import * as z from 'zod'

export const userDataFormSchema = z.object({
  name: z.string().min(3, { message: '3 or more' }).max(30, { message: '30 or less' }),
  avatar: z
    .string()
    .optional()
    .refine(
      async image => {
        if (!image || image === IMAGE_WAS_ERASED) {
          return true
        }
        if (!image.startsWith('data:image')) {
          return true
        }
        if (image) {
          const file = await getFileFromUrl(image)

          // if (file.size > MAX_IMAGE_SIZE_BYTES) {
          // console.warn(
          //   `${imageCrop ? 'even crop of the image' : 'image'} is larger than ${
          //     MAX_IMAGE_SIZE_BYTES / BYTES_IN_MB
          //   } MB - `,
          //   `file size: ${(file.size / BYTES_IN_MB).toFixed(2)}MB`
          // )
          // }
          if (!file) {
            return false
          }

          return file.size <= MAX_IMAGE_SIZE_BYTES
        }
      },
      { message: 'Max image size is 1MB. Try zooming in, or use external editor' }
    ),
})

export type UserProfileFormData = z.infer<typeof userDataFormSchema>
