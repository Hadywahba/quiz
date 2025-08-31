import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '../Layout/Layout';
import Home from '../Pages/main/Home/Home';
import Login from '../Pages/auth/Login/Login';

function App() {

  const router = createBrowserRouter([
    {
      path: '',
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Home />,
        },

        { path: 'Login', element: <Login /> },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
