import { useEffect, useState } from 'react';
import axios from 'axios';
import Constants from './constants';
import './App.css';
import { SortedResults, SearchResults, Doc, SortType} from './types';
import Results from './components/Results';
import { fetchJsonFile, sortDocsBySortType } from './util';
import SearchBar from './components/SearchBar';
import { useQuery } from '@tanstack/react-query';

const App = () => {
  const [searchText, setSearchText] = useState('');
  // const [results, setResults] = useState<SearchResponse | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [ttr, setTtr] = useState<number>(0);
  const [sortType, setSortType] = useState<SortType>('relevance');

  const fetchData = async (limit?: number) => {
    return await fetchJsonFile(
      'http://localhost:5173/src/results.json', 
      limit ?? 5
    );
  };

  const fetchData1 = async () => {
    const ttrStart = performance.now();
    const data = await fetchData(Constants.RESULTS_MAX_PAGES * Constants.RESULTS_PER_PAGE)
    setTtr(performance.now() - ttrStart);
    const scoredSortedDocs = sortDocsBySortType(
      "Introduction to Algorithms", 
      data.docs, 
      sortType
    );
    setPageCount(
      Math.min(
        Math.ceil(data.docs.length / Constants.RESULTS_PER_PAGE), 
        Constants.RESULTS_MAX_PAGES
      )
    );
    const out = { ...data, docs: scoredSortedDocs } as SortedResults;
    return out;
  };

  const { data: results, isLoading, isError } = useQuery(
    ["results"], 
    fetchData1,
    { refetchOnWindowFocus: false,}
  );

  const fetchData2 = async () => {
    const ttrStart = performance.now();
    const data = await fetchData(Constants.RESULTS_MAX_PAGES * Constants.RESULTS_PER_PAGE)
    setTtr(performance.now() - ttrStart);
    const docsAndSortInfo = sortDocsBySortType(
      "Introduction to Algorithms", 
      data.docs, 
      sortType
    );
    setPageCount(
      Math.min(
        Math.ceil(data.docs.length / Constants.RESULTS_PER_PAGE), 
        Constants.RESULTS_MAX_PAGES
      )
    );
    return { ...data, ...docsAndSortInfo } as SortedResults;
  }

  const { data: results2 } = useQuery(
    ['results'], 
    fetchData2,
    { enabled: false }
  );

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleSearchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchText) return;
    fetchData2();
  };
  
  if (isLoading) return <Spinner />;
  if (isError) return <div>error</div>;

  return (
    <div className="App">
      <div className="topbar">[random] [user pref + log]</div>
      <SearchBar 
        onSubmit={handleSearchSubmit} 
        onChange={handleSearchInputChange}
        searchText={searchText}
      />
      <Results
        pageCount={pageCount}
        results={results2 ?? results}
        ttr={ttr}
      />
    </div>
  );
};

export default App

const Spinner = () => {
  return <div className="spinner"></div>
}
