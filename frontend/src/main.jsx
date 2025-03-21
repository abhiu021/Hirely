import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import SignInPage from './auth/sign-in/index.jsx';
import Home from './home/index.jsx';
import Dashboard from './dashboard/index.jsx';
import { ClerkProvider } from '@clerk/clerk-react';
import AdminDashboard from './admin/index.jsx';
import AdminRoute from './component/AdminRoute.jsx';
import EditUser from './admin/EditUser.jsx'; // Import the EditUser component
import EditResume from './dashboard/resume/[resumeId]/edit/index.jsx'
import ViewResume from './my-resume/[resumeId]/view/index.jsx'
import Blog from './pages/Blog.jsx'
import BlogPost from './pages/BlogPost.jsx'
import ATSScoreResult from './dashboard/ats-score-result/index.jsx'
import AboutUs from './about-us/index.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    element: <App />,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path:'/dashboard/resume/:resumeId/edit',
        element:<EditResume/>
      },
      {
        path:'/dashboard/ats-score-result',
        element:<ATSScoreResult/>
      },
      {
        path: '/admin/dashboard',
        element: (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        ),
      },
      {
        path: '/admin/users/:userId/edit',
        element: (
          <AdminRoute>
            <EditUser />
          </AdminRoute>
        ),
      },
    ],
  },
  {
    path: '/auth/sign-in',
    element: <SignInPage />,
  },
  {
    path:'/my-resume/:resumeId/view',
    element:<ViewResume/>
  },
  {
    path:'/blog',
    element:<Blog/>
  },
  {
    path:'/blog/:id',
    element:<BlogPost/>
  },
  {
    path:'/about-us',
    element:<AboutUs/>
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </React.StrictMode>,
);