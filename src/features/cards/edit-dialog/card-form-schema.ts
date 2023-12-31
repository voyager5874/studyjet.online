import { MAX_IMAGE_SIZE_BYTES } from '@/common/app-settings'
import { BYTES_IN_MB } from '@/common/const/file-size-units'
import { IMAGE_WAS_ERASED } from '@/common/const/function-arguments'
import { getFileFromUrl } from '@/utils'
import * as z from 'zod'

export const cardFormSchema = z.object({
  question: z.string().min(3, { message: '3 or more' }).max(500, { message: '500 or less' }),
  answer: z.string().min(3, { message: '3 or more' }).max(500, { message: '500 or less' }),
  questionImg: z
    .array(z.string())
    .length(2)
    .optional()
    .refine(
      async images => {
        if (!images || images[0] === IMAGE_WAS_ERASED) {
          return true
        }
        if (images) {
          const imageCrop = images[1]

          const file = imageCrop ? await getFileFromUrl(imageCrop) : await getFileFromUrl(images[0])

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
    .array(z.string())
    .length(2)
    .optional()
    .refine(
      async images => {
        if (!images || images[0] === IMAGE_WAS_ERASED) {
          return true
        }
        if (images) {
          const imageCrop = images[1]

          const file = imageCrop ? await getFileFromUrl(imageCrop) : await getFileFromUrl(images[0])

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
})

export type CardFormData = z.infer<typeof cardFormSchema>
