import { IconsWithWrapper } from '@/assets/icons/icons-with-wrapper'

import s from './grade.module.scss'

export function Grade({ grade, maxGrade = 5 }: { grade: number; maxGrade?: number }) {
  const filledStars = Array.from({ length: grade })
  const emptyStars = Array.from({ length: maxGrade - grade })

  return (
    <span className={s.container}>
      {filledStars.map((_, idx) => (
        <IconsWithWrapper.star
          color={'var(--color-warning)'}
          fill={'var(--color-warning)'}
          key={idx}
          size={20}
        />
      ))}
      {emptyStars.map((_, idx) => (
        <IconsWithWrapper.star color={'var(--color-warning)'} key={idx} size={16} />
      ))}
    </span>
  )
}
