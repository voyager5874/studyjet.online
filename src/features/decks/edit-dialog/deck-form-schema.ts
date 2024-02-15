import { MAX_IMAGE_SIZE_BYTES } from '@/common/app-settings'
import { BYTES_IN_MB } from '@/common/const/file-size-units'
import { IMAGE_WAS_ERASED } from '@/common/const/function-arguments'
import { getFileFromUrl } from '@/utils'
import * as z from 'zod'

export const deckFormSchema = z.object({
  name: z.string().min(3, { message: '3 or more' }).max(30, { message: '30 or less' }),
  cover: z
    .string()
    .optional()
    .refine(
      async image => {
        if (!image || image === IMAGE_WAS_ERASED) {
          return true
        }
        if (image) {
          const imageCrop = image

          const file = await getFileFromUrl(imageCrop)

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

  isPrivate: z.boolean(),
})

export type DeckFormData = z.infer<typeof deckFormSchema>
