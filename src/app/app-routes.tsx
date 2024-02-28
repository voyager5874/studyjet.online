import { CardsOfDeckPage } from '@/pages/cards-of-deck'
import { CheckEmailPromptPage } from '@/pages/check-email-prompt'
import { DecksPage } from '@/pages/decks'
import { FavoriteDecksPage } from '@/pages/favorite-decks'
import { LearnPage } from '@/pages/learn'
import { RequestPasswordResetPage } from '@/pages/password-reset-request'
import { SetNewPasswordPage } from '@/pages/password-set-new'
import { SignInPage } from '@/pages/sign-in'
import { SignUpPage } from '@/pages/sign-up'
import { UserPage } from '@/pages/user'

export const AppRoutes = {
  private: [
    { element: <DecksPage />, name: 'Decks', path: '/decks', key: 'decks' },
    {
      element: <FavoriteDecksPage />,
      name: 'Favorite decks',
      path: '/favorite-decks',
      key: 'favoriteDecks',
    },
    { element: <UserPage />, name: 'User profile', path: '/user', key: 'userProfile' },
    {
      element: <CardsOfDeckPage />,
      name: 'Cards of a deck',
      path: 'decks/:id/cards',
      key: 'cardsOfDeck',
    },
    { element: <LearnPage />, name: 'Learn a deck', path: 'decks/:id/learn', key: 'learnDeck' },
  ],
  public: [
    {
      element: <RequestPasswordResetPage />,
      name: 'Request password reset',
      path: '/password-reset-request',
      key: 'requestPasswordReset',
    },
    {
      element: <SetNewPasswordPage />,
      name: 'Set new password',
      path: '/password-set-new/:token',
      key: 'setNewPassword',
    },
    { element: <SignInPage />, name: 'Sign in', path: '/sign-in', key: 'signIn' },
    { element: <SignUpPage />, name: 'Sign up', path: '/sign-up', key: 'signUp' },
    {
      element: <CheckEmailPromptPage />,
      name: 'Check email',
      path: '/check-email/:email',
      key: 'checkEmail',
    },
  ],
} as const

export type AppRoutesPath =
  | (typeof AppRoutes)['private'][number]['path']
  | (typeof AppRoutes)['public'][number]['path']

type AppRoutesKey =
  | (typeof AppRoutes)['private'][number]['key']
  | (typeof AppRoutes)['public'][number]['key']

type PathsByKey = {
  [key in AppRoutesKey]: AppRoutesPath
}

const cleanPath = (path: string) => {
  let cleanedPath = path
    .split('/')
    .filter(part => !part.startsWith(':'))
    .join('/')

  if (cleanedPath.endsWith('/')) {
    cleanedPath = cleanedPath.slice(0, -1)
  }

  return cleanedPath
}

export const paths: PathsByKey = {
  ...AppRoutes.private.reduce((acc, route) => {
    return { ...acc, [route.key]: cleanPath(route.path) }
  }, {} as PathsByKey),
  ...AppRoutes.public.reduce((acc, route) => {
    return { ...acc, [route.key]: cleanPath(route.path) }
  }, {} as PathsByKey),
}
