import type { RefObject } from 'react'

//the copy is stale, doesn't work with rect-hook-form
export function getRefContentFullCopy<T extends HTMLElement>(ref: RefObject<T> | null) {
  const fullRefContent = {} as Partial<T>

  if (!ref?.current) {
    return null
  }
  if (ref?.current) {
    //including inherited properties
    for (const key in ref?.current) {
      // @ts-ignore
      fullRefContent[key as keyof T] = ref.current[key as keyof T]
    }
  }

  return fullRefContent
}

// function setNativeValue<T extends HTMLElement>(element: T, value: string) {
//   const valueSetter = Object?.getOwnPropertyDescriptor
//     ? Object.getOwnPropertyDescriptor(element, 'value')!.set!
//     : null
//   const prototype = Object.getPrototypeOf(element)
//   const prototypeValueSetter = prototype
//     ? Object.getOwnPropertyDescriptor(prototype, 'value')!.set!
//     : null
//
//   if (prototypeValueSetter && valueSetter && valueSetter !== prototypeValueSetter) {
//     prototypeValueSetter.call(element, value)
//   } else {
//     valueSetter && valueSetter.call(element, value)
//   }
// }

// https://www.npmjs.com/package/@testing-library/user-event
// this one is certainly a kludge
export function triggerInputChange(node: HTMLInputElement, inputValue: string) {
  const descriptor = Object.getOwnPropertyDescriptor(node, 'value')

  node.value = `${inputValue}#`
  if (descriptor && descriptor.configurable) {
    // todo: https://bobbyhadz.com/blog/typescript-operand-of-delete-operator-must-be-optional
    // @ts-ignore
    delete node.value
  }
  node.value = inputValue

  const e = new Event('change', { bubbles: true, cancelable: false })

  node.dispatchEvent(e)

  if (descriptor) {
    Object.defineProperty(node, 'value', descriptor)
  }
}

export function updateInputText(input: HTMLInputElement, value: string) {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    input.constructor.prototype,
    'value'
  )!.set!

  nativeInputValueSetter.call(input, value)

  const e = new Event('change', { bubbles: true, cancelable: false })

  input.dispatchEvent(e)
}
