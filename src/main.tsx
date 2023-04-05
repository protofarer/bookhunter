import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import './index.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './routes/root';
import ErrorPage from './components/ErrorPage';
import SearchResults from './components/SearchResults';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'search/',
    element: <SearchResults submittedSearchText={''} sortType={'keyword'} />,
  },
]);

// <QueryClientProvider client={queryClient}>
//   <App />
//   <ReactQueryDevtools initialIsOpen={false} />
// </QueryClientProvider>

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
