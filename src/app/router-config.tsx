import type { AppRoutesPath } from '@/app/app-routes'
import type { RouteObject } from 'react-router-dom'

import {
  Navigate,
  Outlet,
  RouterProvider,
  createBrowserRouter,
  useOutletContext,
} from 'react-router-dom'

import { AppRoutes } from '@/app/app-routes'
import { MainLayout } from '@/layouts/main-layout'
import { NotFoundPage } from '@/pages/not-found'

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
  const loggedOut = useOutletContext<boolean>()

  return loggedOut ? <Navigate to={'/sign-in'} /> : <Outlet />
}

function PublicRoutes() {
  const loggedOut = useOutletContext<boolean>()

  return loggedOut ? <Outlet /> : <Navigate to={'/decks'} />
}

/* eslint "perfectionist/sort-objects": "off" */

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        element: <PrivateRoutes />,
        children: [...privateRoutes, ...generateRedirects('/decks')],
        errorElement: <NotFoundPage />,
      },
      {
        element: <PublicRoutes />,
        children: [...publicRoutes, ...generateRedirects('/sign-in')],
        errorElement: <NotFoundPage />,
      },
    ],
  },
])

export const AppContent = () => <RouterProvider router={router} />
