import React from 'react'
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom'
import AuthLayout from './layouts/AuthLayout/AuthLayout'
import { LoginForm } from './pages/LoginForm/LoginForm'
import { RegisterForm } from './pages/RegisterForm/RegisterForm'
import { OrganisationRegisterForm } from './pages/OrganisationRegistration/OrganistaionRegisterForm'
import NotFoundPage from './pages/NotFoundPage/NotFoundPage.tsx';

const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="/auth/login" replace /> }, // Редирект с /auth на /auth/login
      { path: 'login', element: <LoginForm /> },
      { path: 'register', element: <RegisterForm /> },
      { path: 'organisation-register', element: <OrganisationRegisterForm /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> }
])


const RouterConfig: React.FC = () => {
  return <RouterProvider router={router} />
}

export default RouterConfig
