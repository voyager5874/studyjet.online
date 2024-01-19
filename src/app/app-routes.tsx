import { CardsOfDeckPage } from '@/pages/cards-of-deck'
import { DecksPage } from '@/pages/decks'
import { LearnPage } from '@/pages/learn'
import { RequestPasswordResetPage } from '@/pages/password-reset-request'
import { SetNewPasswordPage } from '@/pages/password-set-new'
import { SignInPage } from '@/pages/sign-in'
import { SignUpPage } from '@/pages/sign-up'
import { UserPage } from '@/pages/user'

export const AppRoutes = {
  private: [
    { element: <DecksPage />, name: 'Decks', path: '/decks' },
    { element: <UserPage />, name: 'User profile', path: '/user' },
    { element: <CardsOfDeckPage />, name: 'Cards of a deck', path: 'decks/:id/cards' },
    { path: 'decks/:id/learn', element: <LearnPage />, name: 'Learn a deck' },
  ],
  public: [
    {
      element: <RequestPasswordResetPage />,
      name: 'Request password reset',
      path: '/password-reset',
    },
    { element: <SetNewPasswordPage />, name: 'Set new password', path: '/password-set' },
    { element: <SignInPage />, name: 'Sign in', path: '/sign-in' },
    { element: <SignUpPage />, name: 'Sign up', path: '/sign-up' },
  ],
} as const

export type AppRoutesPath =
  | (typeof AppRoutes)['private'][number]['path']
  | (typeof AppRoutes)['public'][number]['path']
