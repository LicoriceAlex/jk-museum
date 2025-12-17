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
import MainPage from './pages/MainPage/MainPage.tsx';
import Profile from './pages/Profile/Profile.tsx';
import ExhibitionsPage from './pages/ExhibitionsPage/ExhibitionsPage.tsx';

const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="/auth/login" replace /> },
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
      { path: ':id', element: <ExhibitionConstructor /> },
      { path: 'new', element: <ExhibitionConstructor /> },
    ]
  },
  { path: 'exhibitions', element: <ExhibitionsPage /> },
  {path: 'exhibits', element: <ExhibitsPage/>},
  {path: '', element: <MainPage/>},
  {path: 'profile', element: <Profile/>},
  { path: '*', element: <NotFoundPage /> }
])


const RouterConfig: React.FC = () => {
  return <RouterProvider router={router} />
}

export default RouterConfig
