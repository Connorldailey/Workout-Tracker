import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


import App from './App.jsx';
import Homepage from './pages/Homepage.jsx';
import ExplorePage from './pages/Explore.jsx';
import RoutinesPage from './pages/Routines.jsx';
import HistoryPage from './pages/History.jsx';
import WorkoutPage from './pages/Workout.jsx';
import ErrorPage from './pages/ErrorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
      {
        path: '/explore',
        element: <ExplorePage />,
      },
      {
        path: '/routines',
        element: <RoutinesPage />,
      },
      {
        path: '/history',
        element: <HistoryPage />,
      },
      {
        path: '/workout/:routineId',
        element: <WorkoutPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
