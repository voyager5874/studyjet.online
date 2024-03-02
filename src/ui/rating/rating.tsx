import type { ComponentPropsWithoutRef } from 'react'

import { IconsWithWrapper } from '@/assets/icons/icons-with-wrapper'
import { clsx } from 'clsx'

import s from './rating.module.scss'

export type RatingProps = {
  maxRating?: number
  rating: number
  size?: number
} & ComponentPropsWithoutRef<'span'>
export function Rating({ rating, maxRating = 5, size = 16, className, ...restProps }: RatingProps) {
  const filledStars = Array.from({ length: rating })
  const emptyStars = Array.from({ length: maxRating - rating })

  return (
    <span className={clsx(s.container, className)} {...restProps}>
      {filledStars.map((_, idx) => (
        <IconsWithWrapper.star
          color={'var(--color-warning)'}
          fill={'var(--color-warning)'}
          key={idx}
          size={16 * 1.2}
        />
      ))}
      {emptyStars.map((_, idx) => (
        <IconsWithWrapper.star color={'var(--color-warning)'} key={idx} size={size} />
      ))}
    </span>
  )
}
