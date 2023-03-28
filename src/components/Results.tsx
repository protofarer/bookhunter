import { useState } from 'react';
import { SearchResponse, Doc } from '../openlibrary.types';
import Constants from '../constants';

export default function Results({ 
    pageCount, 
    results, 
    ttr,
  }:{ 
    pageCount: number; 
    results: SearchResponse | null; 
    ttr: number;
  }) {

  const [currentPage, setCurrentPage] = useState<number>(1);
  const docs = results?.docs.slice(
    (currentPage - 1) * Constants.RESULTS_PER_PAGE, 
    (currentPage) * Constants.RESULTS_PER_PAGE
  );

  return (
    <>
      {docs && (
        <div className="results">
          <span className="results-info">
            {results?.numFound} results | page {currentPage}/{pageCount} | {(ttr / 1000).toFixed(2)} seconds
          </span>
          <ResultsList
            docs={docs}
          />
          <ResultsNav 
            pageCount={pageCount} 
            currentPage={currentPage} 
            onClick={(pg: number) => { 
              setCurrentPage(pg); 
              console.log(`set currentpage:`, pg)
            }} 
          />
        </div>
      )}
    </>
  );
}

function ResultsList ({ docs }: { docs: Doc[] | null; }) {
  return (
    <>
      {docs && (
        <div className="results-list">
          <ul>
            {docs.map((doc, idx) => (
              <ResultsItem doc={doc} key={idx} />
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

function ResultsNav ({ 
    pageCount, 
    currentPage, 
    onClick 
  }:{
    pageCount: number;
    currentPage: number;
    onClick: (idx: number) => void;
  }) {
  return (
    <div className="resultsNav">
      { pageCount > 1 && 
        <>
          <button 
            onClick={() => onClick(Math.max(currentPage - 1, 1))}
            className={currentPage === 1 ? 'disabledButton' : ''}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {Array.from({ length: pageCount }, (_, idx) => (
            <button 
              key={idx} 
              onClick={() => onClick(idx + 1)}
              className={currentPage === idx + 1 ? 'resultsNav-activeButton' : ''}
            > 
              {" "}{idx + 1}{" "}
            </button>
          ))}

          <button 
            onClick={() => onClick(Math.min(currentPage + 1, pageCount))}
            className={currentPage === pageCount ? 'disabledButton' : ''}
            disabled={currentPage === pageCount}
          >
            Next
          </button>
        </>
      }
    </div>
  );
}

function ResultsItem({ doc, key }: { doc: any; key: number; }) {
  return (
    <li key={key} className="resultsItem">
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
