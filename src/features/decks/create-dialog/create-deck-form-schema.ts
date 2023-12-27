import { MAX_FILE_SIZE } from '@/common/app-settings'
import { BYTES_IN_MB, MAX_IMAGE_SIZE_MB } from '@/common/const/file-size-units'
import { getFileFromUrl } from '@/utils'
import * as z from 'zod'

export const createDeckFormSchema = z.object({
  name: z.string().min(3, { message: '3 or more' }).max(30, { message: '30 or less' }),
  cover: z
    .array(z.string())
    .length(2)
    .optional()
    .refine(
      async images => {
        if (!images) {
          return true
        }
        if (images) {
          const imageCrop = images[1]

          const file = imageCrop ? await getFileFromUrl(imageCrop) : await getFileFromUrl(images[0])

          if (file.size > MAX_FILE_SIZE) {
            //todo: use a toast
            console.warn(
              `${
                imageCrop ? 'even crop of the image' : 'image'
              } is larger than ${MAX_IMAGE_SIZE_MB} MB - `,
              `file size: ${(file.size / BYTES_IN_MB).toFixed(2)}MB`
            )
          }

          return file.size <= MAX_FILE_SIZE
        }
      },
      { message: 'Max image size is 1MB. Try zooming in, or use external editor' }
    ),

  isPrivate: z.boolean(),
})

export type CreateDeckData = z.infer<typeof createDeckFormSchema>
