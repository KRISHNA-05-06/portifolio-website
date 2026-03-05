import { RouterProvider } from 'react-router';
import { router } from './routes';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    document.title = 'Sri Krishna Sai Kota | Portfolio';
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
