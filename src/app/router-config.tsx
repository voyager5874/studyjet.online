import type { AppRoutesPath } from '@/app/app-routes'
import type { RouteObject } from 'react-router-dom'

import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'

import { AppRoutes } from '@/app/app-routes'
import { useMeQuery } from '@/features/user/api'
import { MainLayout } from '@/layouts/main-layout'
import { NotFoundPage } from '@/pages/not-found'
import { Spinner } from '@/ui/spinner'

const generateRedirects = (to: AppRoutesPath) => {
  return [
    { path: '/', element: <Navigate to={to} /> },
    { path: '*', element: <Navigate to={to} /> },
  ]
}

const privateRoutes: RouteObject[] = AppRoutes.private.map(item => ({
  path: item.path,
  element: item.element,
}))

const publicRoutes: RouteObject[] = AppRoutes.public.map(item => ({
  path: item.path,
  element: item.element,
}))

function PrivateRoutes() {
  const { data, isLoading } = useMeQuery()

  const isAuthenticated = Boolean(data?.id)

  if (isLoading) {
    return <Spinner />
  }

  return isAuthenticated ? <MainLayout /> : <Navigate to={'/sign-in'} />
}

function PublicRoutes() {
  const { data, isLoading } = useMeQuery()

  const isAuthenticated = Boolean(data?.id)

  if (isLoading) {
    return <Spinner />
  }

  return isAuthenticated ? <Navigate to={'/decks'} /> : <MainLayout />
}

/* eslint "perfectionist/sort-objects": "off" */

const router = createBrowserRouter([
  {
    path: '/',
    element: <PrivateRoutes />,
    children: [...privateRoutes, ...generateRedirects('/decks')],
    errorElement: <NotFoundPage />,
  },
  {
    path: '/',
    element: <PublicRoutes />,
    children: [...publicRoutes, ...generateRedirects('/sign-in')],
    errorElement: <NotFoundPage />,
  },
])

export const AppContent = () => <RouterProvider router={router} />
