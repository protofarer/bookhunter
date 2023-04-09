import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import * as Root from './routes/root';
import ErrorPage from './components/ErrorPage';
import * as Index from './routes/index';
import SearchResultsContainer from './components/SearchResultsContainer';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import * as SearchResults from './components/SearchResultsContainer';
import Spinner from './components/Spinner';

const queryClient = new QueryClient();
export { queryClient };

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root.default />,
    errorElement: <ErrorPage />,
    children: [{ index: true, element: <Index.default /> }],
    action: Root.action,
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
      <RouterProvider router={router} fallbackElement={<Spinner />} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
