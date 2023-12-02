import { Provider } from 'react-redux'

import { AppContent } from '@/app/router-config'
import { store } from '@/app/store'

export function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}
