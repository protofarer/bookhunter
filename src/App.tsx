import { useEffect, useState } from 'react';
import axios from 'axios';
import Constants from './constants';
import './App.css';
import { SearchResponse, Doc } from './openlibrary.types';
import Results from './components/Results';
import { fetchJsonFile } from './util';

const App = () => {
  const [searchText, setSearchText] = useState('');
  const [initResults, setInitResults] = useState<SearchResponse | null>(null);
  const [additionalResults, setAdditionalResults] = useState<SearchResponse | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);

  const [loading, setLoading] = useState(false);

  const fetchData = async (limit?: number) => {
    const data = await fetchJsonFile(
      'http://localhost:5173/src/results.json', 
      limit ?? 5
    );
    return data;
  };

  // fake api call, first page results
  useEffect(() => {
    (async function () {
      try {
        const data = await fetchData(5);
        console.log(`fetched init results`, )
        
        setInitResults(data);
        setPageCount(1);
      } catch (err) {
        console.error('Error fetching first page results:', err);
      }
    })();
  }, []);  

  useEffect(() => {
    (async function () {
      try {
        const data = await fetchData(
          Constants.RESULTS_PER_PAGE * Constants.RESULTS_MAX_PAGES
        );
        console.log(`fetched add results`, )
        
        setAdditionalResults(data);
        setPageCount(
          Math.max(
            Math.ceil(Constants.RESULTS_PER_PAGE * Constants.RESULTS_MAX_PAGES / data.docs.length), 
            Constants.RESULTS_MAX_PAGES
          )
        );
      } catch (err) {
        console.error('Error fetching additional results:', err);
      }
    })();
  }, []);  

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleSearchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchText) return;

    setLoading(true);

    try {
      const response = await axios.get(`https://openlibrary.org/search.json?q=${searchText}&limit=5`);
      setInitResults(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Search for books"
          value={searchText}
          onChange={handleSearchInputChange}
        />
        <button type="submit">
          🔍
        </button>
      </form>

      {loading ? (
        <Spinner />
      ) : (
          <Results
            pageCount={pageCount}
            initResults={initResults}
            additionalResults={additionalResults}
          />
        )
      }
    </div>
  );
};

export default App

const Spinner = () => {
  return <div className="spinner"></div>
}
