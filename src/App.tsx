import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'
// import savedResults from './results.json' assert {type: 'json'}

const App: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchJsonFile('http://localhost:5173/src/results.json');
      console.log(`data`, data.docs[0].title)
      
      setResults(data);
    };
    fetchData();
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
        )
      )}
    </div>
  );
};

export default App

interface IResultsItem {
  doc: any;
  key: number;
}
const ResultsItem: React.FC<IResultsItem> = ({ doc, key }) => {
  return (
    <ul key={key}>
      <h2>{doc.title}</h2>
      <li>author: {doc.author_name}</li>
      <li>published on: {doc.publish_date}</li>
      <li>publisher: {doc.publisher}</li>
      <li>1st isbn: {doc.isbn?.[0]}</li>
    </ul>

  )
}

const Spinner: React.FC = () => {
  return <div className="spinner"></div>
}

async function fetchJsonFile(fileUrl: string) {
  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const jsonObject = await response.json();
    return jsonObject;
  } catch (error) {
    console.error('Error fetching JSON file:', error);
    return null;
  }
}
