import { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import Constants from './constants';
import './App.css';
import { SortedResults, SearchResults, Doc, SortType} from './types';
import Results from './components/Results';
import { fetchJsonFile, sortDocsBySortType, SUBJECTS } from './util';
import SearchBar from './components/SearchBar';
import { useQuery } from '@tanstack/react-query';

const App = () => {
  const [searchText, setSearchText] = useState('');
  const [submittedSearchText, setSubmittedSearchText] = useState('');

  const [sortType, setSortType] = useState<SortType>('relevance');
  // const prevSortTypeRef = useRef(sortType);

  const queryKey = useMemo(
    () => ['results', submittedSearchText, sortType], 
    [submittedSearchText, sortType]
  );


  const [pageCount, setPageCount] = useState<number>(0);
  const [ttr, setTtr] = useState<number>(0);
  const [subject, setSubject] = useState<string>('');

  const fetchData = async (limit?: number) => {
    return await fetchJsonFile(
      'http://localhost:5173/src/results.json', 
      limit ?? 5
    );
  };

  const fetchData2 = async () => {
    const ttrStart = performance.now();
    const { data } = await axios(`https://openlibrary.org/search.json?q=${searchText}&limit=${Constants.RESULTS_MAX_PAGES * Constants.RESULTS_PER_PAGE}`);
    setTtr(performance.now() - ttrStart);
    
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
    isLoading, 
    isFetching, 
    isError,
  } = useQuery(
    queryKey, 
    fetchData2,
    { 
      enabled: !!submittedSearchText,
      refetchOnWindowFocus: false,
    }
  );

  // TODO separate score/sort from query
  // const sortedResults = (() => {

  // })();
  

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  // ! tmp - this will not resort the data because queryFn has the sort logic
  const handleSearchSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!searchText) return;

    setSubmittedSearchText(searchText);
  };

  useEffect(() => {
    const subject = SUBJECTS[Math.floor(Math.random()*SUBJECTS.length)];
    setSubject(subject);
  }, []);
  
  return (
    <div className="App">
      <div className="topbar">
        [Random book on {subject}] [user pref + log]
      </div>
      <SearchBar 
        onSubmit={handleSearchSubmit} 
        onChange={handleSearchInputChange}
        searchText={searchText}
        setSortType={setSortType}
        sortType={sortType}
      />
      {isError ? (
        <div>error</div>
        ) : (
          isFetching && isLoading ? (
          <Spinner />
          ) : ( 
            <Results
              pageCount={pageCount}
              results={results2}
              ttr={ttr}
            />
          )
        )
      }
    </div>
  );
};

export default App

const Spinner = () => {
  return <div className="spinner"></div>
}
