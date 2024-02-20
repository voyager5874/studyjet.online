import type { FileInputProps } from './file-input'

import { removeFileExtension } from '@/utils'

const MAX_LENGTH = 100
const DEFAULT_NAME = 'default-value'

export function getDefaultValueFileName(defaultValue: FileInputProps['defaultValue']) {
  if (typeof defaultValue === 'string') {
    return defaultValue.length > MAX_LENGTH ? DEFAULT_NAME : removeFileExtension(defaultValue)
  }
  if (defaultValue instanceof File) {
    return defaultValue.name
  }

  return DEFAULT_NAME
}
