import { AppContent } from '@/app/router-config'
import { useMeQuery } from '@/features/user/api'
import { useLocalStorage } from '@/hooks'
import { Spinner } from '@/ui/spinner'

export function App() {
  const { isLoading, isUninitialized } = useMeQuery()

  const [value] = useLocalStorage('theme', 'dark')

  document.body.dataset.theme = value

  if (isLoading && isUninitialized) {
    return <Spinner />
  }

  return <AppContent />
}
