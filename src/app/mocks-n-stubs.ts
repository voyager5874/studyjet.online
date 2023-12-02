import { selectAppUnlockStatus } from '@/app/app-state-slice'
import { useAppSelector } from '@/app/store'

export const useAppUnlockStatus = () => {
  return useAppSelector(state => selectAppUnlockStatus(state))
}
