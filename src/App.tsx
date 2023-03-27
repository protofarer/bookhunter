import { useEffect, useState } from 'react';
import axios from 'axios';
import Constants from './constants';
import './App.css';
import { SearchResponse, Doc } from './openlibrary.types';

const App: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [additionalResults, setAdditionalResults] = useState<SearchResponse | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

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
        const results = await fetchData(5);
        setResults(results);
        setPageCount(1);
      } catch (err) {
        console.error('Error fetching first page results:', err);
      }
    })();
  }, []);  

  useEffect(() => {
    (async function () {
      try {
        const additionalResults = await fetchData(
          Constants.RESULTS_PER_PAGE * Constants.RESULTS_MAX_PAGES
        );
        setAdditionalResults(additionalResults);
        setPageCount(
          Math.max(
            Math.ceil(Constants.RESULTS_PER_PAGE * Constants.RESULTS_MAX_PAGES / additionalResults.docs.length), 
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
      const response = await axios.get(`https://openlibrary.org/search.json?q=${searchText}`);
      setResults(response.data);
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
        results && (
          <>
            <div className="results">
              <p>Found {results.numFound} results</p>
              <ul>
                {
                  results.docs.map((doc: any, i: number) => (
                    <ResultsItem doc={doc} key={i}/>
                  ))
                }
              </ul>
            </div>
            <ResultsNav 
              pageCount={pageCount} 
              currentPage={currentPage} 
              onClick={(idx: number) => { 
                setCurrentPage(idx); 
                console.log(`setpageto`, idx)
              }} 
            />
          </>
        )
      )}
    </div>
  );
};

export default App

const ResultsNav = ({ pageCount, currentPage, onClick }: { pageCount: number, currentPage: number, onClick: Function}) => {
  return (
    <div className="resultsNav">
      { pageCount > 1 && 
        <>
          <button onClick={() => onClick(Math.min(currentPage - 1, 1))}>Prev</button>
          {Array.from({ length: pageCount }, (_, idx) => (
            <button key={idx} onClick={() => onClick(idx + 1)}> {idx + 1} </button>
          ))}
          <button onClick={() => onClick(Math.min(currentPage + 1, pageCount))}>Next</button>
        </>
      }
    </div>
  );
}

interface IResultsPage {
  results: Doc[] | null;
}

const ResultsPage = ({ results }: IResultsPage) => {
}

interface IResultsItem {
  doc: any;
  key: number;
}
const ResultsItem = ({ doc, key }: IResultsItem) => {
  return (
    <li key={key}>
      <ul>
        <h2>{doc.title}</h2>
        <li>OL API type: {doc.type}</li>
        <li>author: {doc.author_name}</li>
        <li>published on: {doc.publish_date[0]}</li>
        <li>publisher: {doc.publisher?.[0]}</li>
        <li>1st isbn: {doc.isbn?.[0]}</li>
      </ul>
    </li>

  )
}

const Spinner: React.FC = () => {
  return <div className="spinner"></div>
}

async function fetchJsonFile(fileUrl: string, limit?: number) {
  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const jsonObject = await response.json();

    return { 
      ...jsonObject, 
      docs: limit ? jsonObject.docs.slice(0, limit) : jsonObject.docs 
    };
  } catch (error) {
    console.error('Error fetching JSON file:', error);
    return null;
  }
}
