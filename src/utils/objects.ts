import { IMAGE_WAS_ERASED } from '@/common/const/function-arguments'
import { getFileFromUrl } from '@/utils/image-files'

export const stripObjectEmptyProperties = <T extends object>(obj: T): T => {
  const objCopy: T = { ...obj }
  const keys = Object.keys(obj) as Array<keyof T>

  keys.forEach(key => {
    if (typeof objCopy[key] !== 'boolean' && !objCopy[key]) {
      delete objCopy[key]
    }
  })

  return objCopy
}

export function isObjectEmpty(objectName: object): boolean {
  return JSON.stringify(objectName) === '{}'
}

export function getChangedData<T extends object>(dataToApply: FormData, currentData: T) {
  const patch = {} as Partial<T>
  const keysToUpdate = Object.keys(currentData) as (keyof T)[]

  for (const key of keysToUpdate) {
    const entry = dataToApply.get(key as string)

    if (entry && entry instanceof File) {
      patch[key] = URL.createObjectURL(entry) as T[keyof T]
    }
    if (typeof entry === 'string' && entry !== currentData[key]) {
      patch[key] = entry as T[keyof T]
    }
  }

  return patch
}

export function mutateObjectValues<T>(objToMutate: T, patch: Partial<T>) {
  const keys = Object.keys(patch) as (keyof T)[]

  for (const key of keys) {
    if (typeof objToMutate[key] !== 'undefined') {
      objToMutate[key] = patch[key] as T[keyof T]
    }
  }
}

export async function getChangedDataFromTwoObjects<T extends object>(
  dataToApply: { [key in keyof T]?: File | boolean | string },
  currentData: T
): Promise<Partial<T>> {
  const patch = {} as Partial<T>
  const keysToUpdate = Object.keys(currentData) as (keyof T)[]

  for (const key of keysToUpdate) {
    const entry = dataToApply[key]

    if (entry && entry instanceof File) {
      patch[key] = entry as T[keyof T]
    }
    if (typeof entry !== 'undefined' && entry !== currentData[key] && entry !== '') {
      let value = entry

      if (entry === IMAGE_WAS_ERASED) {
        value = ''
      }
      if (typeof entry === 'string' && entry.startsWith('data:image')) {
        const file = await getFileFromUrl(entry)

        file && (value = file)
      }

      patch[key] = value as T[keyof T]
    }
  }

  return patch
}

export function objectToFormData(obj: Record<string, any>): FormData {
  const formData = new FormData()

  Object.entries(obj).forEach(([key, value]) => {
    formData.append(key, value)
  })

  return formData
}

export async function createSubmitData<T extends object>(
  newData: { [key in keyof T]?: File | boolean | string },
  currentData: T
) {
  const changedData = await getChangedDataFromTwoObjects(newData, currentData)

  return objectToFormData(changedData)
}
