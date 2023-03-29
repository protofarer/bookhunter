import { useEffect, useState } from 'react';
import axios from 'axios';
import Constants from './constants';
import './App.css';
import { SortedResults, SearchResults, Doc, SortType} from './types';
import Results from './components/Results';
import { fetchJsonFile, sortDocsBySortType, SUBJECTS } from './util';
import SearchBar from './components/SearchBar';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const App = () => {
  const [searchText, setSearchText] = useState('');
  // const [results, setResults] = useState<SearchResponse | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [ttr, setTtr] = useState<number>(0);
  const [sortType, setSortType] = useState<SortType>('relevance');
  const queryClient = useQueryClient();

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
    console.log(`fetchdata2 invoked`, )
    
    const ttrStart = performance.now();
    // const data = await fetchData(Constants.RESULTS_MAX_PAGES * Constants.RESULTS_PER_PAGE)
    
    const response = await fetch(`https://openlibrary.org/search.json?q=${searchText}&limit=${Constants.RESULTS_MAX_PAGES * Constants.RESULTS_PER_PAGE}`);
    if (!response.ok) throw new Error('Network response not ok');
    setTtr(performance.now() - ttrStart);

    const data = await response.json();
    console.log(`data`, data)
    
    const scoredSortedDocs = sortDocsBySortType(
      searchText, 
      data.docs, 
      sortType
    );
    setPageCount(
      Math.min(
        Math.ceil(data.docs.length / Constants.RESULTS_PER_PAGE), 
        Constants.RESULTS_MAX_PAGES
      )
    );
    const sortedResults = { ...data, docs: scoredSortedDocs } as SortedResults;
    return sortedResults;
  }

  const { 
    data: results2, 
    isLoading: isLoading2, 
    isFetching, 
    isError: isError2,
    refetch,
  } = useQuery(
    ['results2'], 
    fetchData2,
    { 
      enabled: false,
      refetchOnWindowFocus: false,
    }
  );

  // TODO separate score/sort from query
  // const sortedResults = (() => {

  // })();
  

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleSearchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchText) return;

    console.log(`search clicked`, )
    
    refetch();
  };
  
  if (isError2 || isError2) return <div>error</div>;

  return (
    <div className="App">
      <div className="topbar">
        [Random book on {SUBJECTS[Math.floor(Math.random()*SUBJECTS.length)]}] [user pref + log]
      </div>
      <SearchBar 
        onSubmit={handleSearchSubmit} 
        onChange={handleSearchInputChange}
        searchText={searchText}
        setSortType={setSortType}
        sortType={sortType}
      />
      {isFetching && isLoading2 ? (
        <Spinner />
      ) : ( 
        <Results
          pageCount={pageCount}
          results={results2 || results}
          ttr={ttr}
        />
      )}
    </div>
  );
};

export default App

const Spinner = () => {
  return <div className="spinner"></div>
}
