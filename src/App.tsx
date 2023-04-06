import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Root from './routes/root';
import ErrorPage from './components/ErrorPage';
import Index from './components/Index';
import SearchResultsContainer from './components/SearchResultsContainer';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import * as SearchResults from './components/SearchResultsContainer';

const queryClient = new QueryClient();
export { queryClient };

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [{ index: true, element: <Index /> }],
  },
  {
    path: 'search/',
    element: <SearchResultsContainer />,
    loader: SearchResults.loader,
  },
]);

// <QueryClientProvider client={queryClient}>
//   <App />
// </QueryClientProvider>

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
