import { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import Constants from './constants';
import './App.css';
import { SortedResults, SearchResults, Doc, SortType} from './types';
import Results from './components/Results';
import { fetchJsonFile, sortDocsBySortType, SUBJECTS } from './util';
import SearchBar from './components/SearchBar';
import { useQuery } from '@tanstack/react-query';
import Spinner from './components/Spinner';

const App = () => {
  const [submittedSearchText, setSubmittedSearchText] = useState('');
  const [sortType, setSortType] = useState<SortType>('relevance');

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
    const { data } = await axios(`https://openlibrary.org/search.json?q=${submittedSearchText}&limit=${Constants.RESULTS_MAX_PAGES * Constants.RESULTS_PER_PAGE}`);
    setTtr(performance.now() - ttrStart);
    return data;
  }

  const { 
    data: rawResults, 
    isLoading, 
    isFetching, 
    isError,
  } = useQuery(
    ["results", submittedSearchText], 
    fetchData2,
    { 
      enabled: !!submittedSearchText,
      refetchOnWindowFocus: false,
    }
  );

  const sortedResults = useMemo(
    () => processRawResults(rawResults, submittedSearchText, sortType),
    [submittedSearchText, rawResults, sortType]
  )

  function processRawResults(rawResults: SearchResults, submittedSearchText: string, sortType: SortType) {
    if (rawResults) {
      const scoredSortedDocs = sortDocsBySortType(
        submittedSearchText, 
        rawResults.docs, 
        sortType
      );
      setPageCount(
        Math.min(
          Math.ceil(rawResults.docs.length / Constants.RESULTS_PER_PAGE), 
          Constants.RESULTS_MAX_PAGES
        )
      );
      const sortedResults = { ...rawResults, docs: scoredSortedDocs };
      return sortedResults;
    }
  }



  useEffect(() => {
    const subject = SUBJECTS[Math.floor(Math.random()*SUBJECTS.length)];
    setSubject(subject);
  }, []);

  return (
    <div className="App">
      <div className="homebar">
        <span>YABF </span><span>[Random book on {subject}]</span> <span>[user pref + log]</span>
      </div>
      <SearchBar 
        setSortType={setSortType}
        sortType={sortType}
        setSubmittedSearchText={setSubmittedSearchText}
      />
      {isError ? (
        <div>error</div>
        ) : (
          isFetching && isLoading ? (
          <Spinner />
          ) : ( 
            <Results
              pageCount={pageCount}
              results={sortedResults}
              ttr={ttr}
            />
          )
        )
      }
    </div>
  );
};

export default App
