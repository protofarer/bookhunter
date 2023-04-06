import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import './index.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './routes/root';
import ErrorPage from './components/ErrorPage';
import SearchResultsContainer from './components/SearchResultsContainer';
import Index from './components/Index';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [{ index: true, element: <Index /> }],
  },
  {
    path: 'search/',
    element: (
      <SearchResultsContainer submittedSearchText={''} sortType={'keyword'} />
    ),
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
