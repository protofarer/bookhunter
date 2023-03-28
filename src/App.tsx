import { useEffect, useState } from 'react';
import axios from 'axios';
import Constants from './constants';
import './App.css';
import { SearchResponse, Doc, SortType} from './types';
import Results from './components/Results';
import { fetchJsonFile, sortDocsBySortType } from './util';

const App = () => {
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [ttr, setTtr] = useState<number>(0);
  const [sortType, setSortType] = useState<SortType>('relevance');

  const [loading, setLoading] = useState(false);

  const fetchData = async (limit?: number) => {
    const data = await fetchJsonFile(
      'http://localhost:5173/src/results.json', 
      limit ?? 5
    );
    return data;
  };

  // time it, fetch it, sort it, set it
  useEffect(() => {
    (async function () {
      try {
        const ttrStart = Date.now();
        const data = await fetchData(
          Constants.RESULTS_PER_PAGE * Constants.RESULTS_MAX_PAGES
        );
        setTtr(Date.now() - ttrStart);
        console.log(`fetched add results`, )
        const sortedDocs = sortDocsBySortType("Introduction to Algorithms", data.docs)
        // setResults(data);
        
        setResults({ ...data, docs: sortedDocs });
        setPageCount(
          Math.min(
            Math.ceil(data.docs.length / Constants.RESULTS_PER_PAGE), 
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
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="topbar">[random] [user pref + log]</div>
      <form 
        className="searchForm"
        onSubmit={handleSearchSubmit}>
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

      {
        loading 
        ? <Spinner />
        : <Results
            pageCount={pageCount}
            results={results}
            ttr={ttr}
          />
      }
    </div>
  );
};

export default App

const Spinner = () => {
  return <div className="spinner"></div>
}
