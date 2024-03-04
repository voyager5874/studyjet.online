import type * as AvatarPrimitive from '@radix-ui/react-avatar'

import type { ComponentPropsWithoutRef, ElementRef } from 'react'
import { forwardRef } from 'react'

import { clsx } from 'clsx'

import { AvatarFallback, AvatarImage, AvatarRoot } from './avatar-base'

export type AvatarProps = {
  image?: null | string
  username: string
} & ComponentPropsWithoutRef<typeof AvatarRoot>

const UserAvatar = forwardRef<ElementRef<typeof AvatarPrimitive.Root>, AvatarProps>(
  (props, forwardedRef) => {
    const { className, username, image, ...restProps } = props
    const fallbackText = getFallbackText(username)

    return (
      <AvatarRoot {...restProps} className={clsx(className)} ref={forwardedRef}>
        {image && <AvatarImage src={image} />}
        <AvatarFallback>{fallbackText}</AvatarFallback>
      </AvatarRoot>
    )
  }
)

function getFallbackText(name: string | undefined) {
  if (!name) {
    return 'JD'
  }

  const nameSplit = name.split(' ')

  if (nameSplit.length >= 2) {
    return `${nameSplit[0][0].toUpperCase()}${nameSplit[1][0].toUpperCase()}`
  }

  return `${name[0].toUpperCase()}${name[1]}`
}

export { UserAvatar }
