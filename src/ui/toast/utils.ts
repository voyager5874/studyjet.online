import type { Toast } from '@/ui/toast/toast'

import type { ComponentPropsWithoutRef } from 'react'

export function getToastSwipeDirection(
  position: ComponentPropsWithoutRef<typeof Toast>['position']
) {
  if (position?.includes('Center')) {
    return 'right'
  }
  if (position?.includes('Right')) {
    return 'right'
  }

  if (position?.includes('Left')) {
    return 'left'
  }

  if (position?.includes('auto')) {
    return 'right'
  }
}
