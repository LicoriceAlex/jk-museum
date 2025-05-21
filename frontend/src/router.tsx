import React from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import AuthLayout from './layouts/AuthLayout/AuthLayout'
import { LoginForm } from './pages/LoginForm/LoginForm'
import { RegisterForm } from './pages/RegisterForm/RegisterForm'
import { OrganisationRegisterForm } from './pages/OrganisationRegistration/OrganistaionRegisterForm'
import NotFoundPage from './pages/NotFoundPage/NotFoundPage.tsx';
import ExhibitsPage from './pages/ExhibitsPage/ExhibitsPage.tsx';
import ExhibitionConstructor
  from './pages/ExhibitionConstructor/ExhibitionConstructor.tsx';

const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="/auth/login" replace /> }, // Редирект с /auth на /auth/login
      { path: 'login', element: <LoginForm /> },
      { path: 'register', element: <RegisterForm /> },
      { path: 'organisation-register', element: <OrganisationRegisterForm /> },
      {path: 'exhibits', element: <ExhibitsPage/>},
    ],
  },
  {
    path: 'constructor',
    children: [
      { index: true, element: <ExhibitionConstructor /> },
      { path: ':id', element: <ExhibitionConstructor /> }, // Для редактирования существующей выставки
      { path: 'new', element: <ExhibitionConstructor /> }, // Для создания новой выставки
    ]
  },
  {path: 'exhibits', element: <ExhibitsPage/>},
  { path: '*', element: <NotFoundPage /> }
])


const RouterConfig: React.FC = () => {
  return <RouterProvider router={router} />
}

export default RouterConfig
