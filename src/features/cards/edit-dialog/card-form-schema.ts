import { MAX_IMAGE_SIZE_BYTES } from '@/common/app-settings'
import { BYTES_IN_MB } from '@/common/const/file-size-units'
import { IMAGE_WAS_ERASED } from '@/common/const/function-arguments'
import { getFileFromUrl } from '@/utils'
import * as z from 'zod'

export const cardFormSchema = z.object({
  question: z.string().min(3, { message: '3 or more' }).max(500, { message: '500 or less' }),
  answer: z.string().min(3, { message: '3 or more' }).max(500, { message: '500 or less' }),
  questionImg: z
    .string()
    .optional()
    .refine(
      async image => {
        if (!image || image === IMAGE_WAS_ERASED) {
          return true
        }
        if (image) {
          const imageCrop = image

          const file = imageCrop ? await getFileFromUrl(imageCrop) : await getFileFromUrl(image)

          if (!file) {
            return false
          }

          if (file.size > MAX_IMAGE_SIZE_BYTES) {
            //todo: use a toast
            console.warn(
              `${imageCrop ? 'even crop of the image' : 'image'} is larger than ${
                MAX_IMAGE_SIZE_BYTES / BYTES_IN_MB
              } MB - `,
              `file size: ${(file.size / BYTES_IN_MB).toFixed(2)}MB`
            )
          }

          return file.size <= MAX_IMAGE_SIZE_BYTES
        }
      },
      { message: 'Max image size is 1MB. Try zooming in, or use external editor' }
    ),
  answerImg: z
    .string()
    .optional()
    .refine(
      async image => {
        if (!image || image === IMAGE_WAS_ERASED) {
          return true
        }
        if (image) {
          if (!image.startsWith('data:image')) {
            return true
          }
          const file = await getFileFromUrl(image)

          if (!file) {
            return false
          }

          if (file.size > MAX_IMAGE_SIZE_BYTES) {
            //todo: use a toast
            console.warn(
              `${image ? 'even crop of the image' : 'image'} is larger than ${
                MAX_IMAGE_SIZE_BYTES / BYTES_IN_MB
              } MB - `,
              `file size: ${(file.size / BYTES_IN_MB).toFixed(2)}MB`
            )
          }

          return file.size <= MAX_IMAGE_SIZE_BYTES
        }
      },
      { message: 'Max image size is 1MB. Try zooming in, or use external editor' }
    ),
})

export type CardFormData = z.infer<typeof cardFormSchema>
