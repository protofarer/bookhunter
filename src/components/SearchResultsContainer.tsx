import { useState } from 'react';
import type {
  ScoredDoc,
  SearchResults,
  SortedResults,
  SortType,
  LoaderData,
} from '../types';
import Constants from '../constants';
import { makeCoverURL, sortDocsBySortType } from '../util';
import { useQuery } from '@tanstack/react-query';
import Spinner from './Spinner';
import axios from 'axios';
import { LoaderFunction, redirect, useLoaderData } from 'react-router-dom';
import SearchBar from './SearchBar';
import { queryClient } from '../App';

import type { Params } from 'react-router-dom';

const fetchData2 = async (submittedSearchText: string) => {
  const ttrStart = performance.now();
  const { data }: { data: SearchResults } = await axios(
    `https://openlibrary.org/search.json?q=${submittedSearchText}&limit=${
      Constants.RESULTS_MAX_PAGES * Constants.RESULTS_PER_PAGE
    }`
  );

  const ttr = performance.now() - ttrStart;
  return { data, ttr };
};

function processRawResults(
  rawResults: SearchResults | undefined,
  submittedSearchText: string,
  sortType: SortType
): SortedResults | undefined {
  if (rawResults) {
    const scoredSortedDocs = sortDocsBySortType(
      submittedSearchText,
      rawResults.docs,
      sortType
    );
    const sortedResults = { ...rawResults, docs: scoredSortedDocs };
    return sortedResults;
  }
}

export const loader = (async ({ params }: { params: Params }) => {
  // TODO error handle
  if (!params.searchInput || !params.sortType) {
    throw redirect('/');
  }

  if (
    typeof params.searchInput !== 'string' ||
    typeof params.sortType !== 'string'
  ) {
    throw Error('params somehow not strings??');
    // throw redirect('/');
  }

  // TODO type narrow searchInput
  const { data: rawResults, ttr }: { data: SearchResults; ttr: string } =
    await queryClient.fetchQuery(
      ['results', params.searchInput, params.sortType],
      () => fetchData2(params.searchInput)
    );

  const pageCount = Math.min(
    Math.ceil(rawResults.docs.length / Constants.RESULTS_PER_PAGE),
    Constants.RESULTS_MAX_PAGES
  );

  // const sortedResults = useMemo(
  //   () => processRawResults(rawResults, submittedSearchText, sortType),
  //   [submittedSearchText, rawResults, sortType]
  // );

  // ? CSDR tiny-invariant to type narrow params

  const sortedResults = processRawResults(
    rawResults,
    params.searchInput,
    params.sortType as SortType
  );

  return { sortedResults, ttr, pageCount };
}) satisfies LoaderFunction;

export default function SearchResultsContainer() {
  // const [pageCount, setPageCount] = useState<number>(0);
  const { sortedResults, ttr, pageCount } = useLoaderData() as LoaderData<
    typeof loader
  >;

  // const fetchData = async (limit?: number) => {
  //   return await fetchJsonFile(
  //     'http://localhost:5173/src/results.json',
  //     limit ?? 5
  //   );
  // };

  const {
    data: rawResults,
    isLoading,
    isFetching,
    isError,
  } = useQuery(['results', submittedSearchText], fetchData2, {
    enabled: !!submittedSearchText,
    refetchOnWindowFocus: false,
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const docs = sortedResults?.docs.slice(
    (currentPage - 1) * Constants.RESULTS_PER_PAGE,
    currentPage * Constants.RESULTS_PER_PAGE
  );
  console.log(`docs`, docs);

  return (
    <>
      {isError ? (
        <div>error</div>
      ) : isFetching && isLoading ? (
        <Spinner />
      ) : sortedResults ? (
        <div className="searchResultsPage">
          <SearchBar />
          <div className="results">
            <div className="results-info">
              <>
                {sortedResults?.numFound} result
                {sortedResults?.numFound > 1 && 's'} | page {currentPage}/
                {pageCount} | {(ttr / 1000).toFixed(2)} seconds
              </>
            </div>
            {docs && <ResultsList docs={docs} />}
            <ResultsNav
              pageCount={pageCount}
              currentPage={currentPage}
              onClick={(pg: number) => {
                setCurrentPage(pg);
              }}
            />
          </div>
        </div>
      ) : (
        submittedSearchText.length > 0 && <div>no results matched query </div>
      )}
    </>
  );
}

function ResultsList({ docs }: { docs: ScoredDoc[] | null }) {
  return (
    <>
      {docs && (
        <div className="results-list">
          <ul>
            {docs.map((doc, idx) => (
              <li key={idx}>
                <ResultsItem doc={doc} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

function ResultsNav({
  pageCount,
  currentPage,
  onClick,
}: {
  pageCount: number;
  currentPage: number;
  onClick: (idx: number) => void;
}) {
  return (
    <div className="resultsNav">
      {pageCount > 1 && (
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
              className={
                currentPage === idx + 1 ? 'resultsNav-activeButton' : ''
              }
            >
              {' '}
              {idx + 1}{' '}
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
      )}
    </div>
  );
}

function ResultsItem({ doc }: { doc: ScoredDoc }) {
  return (
    <ul className="resultsItem">
      <h2>{doc.title}</h2>
      <li>
        <em>SortType: {doc.sortType}</em>
      </li>
      <li>
        <em>rel score: {doc.score.relevance}</em>
      </li>
      <li>
        <em>keyword score: {doc.score.keyword}</em>
      </li>
      <li>
        <em>read score: {doc.score.readlog}</em>
      </li>
      <li>
        <em>rate score: {doc.score.ratingcount}</em>
      </li>
      <li>
        author(s): {doc.author_name && doc.author_name.slice(0, 2).join(', ')}
        {doc.author_name && doc.author_name.length > 2 && ', ...'}
      </li>
      <li>published on: {doc.publish_date?.[0]}</li>
      <li>publisher: {doc.publisher?.[0]}</li>
      <li>1st isbn: {doc.isbn?.[0]}</li>
      <li>
        {doc.isbn && (
          <img
            src={makeCoverURL({ key: 'isbn', value: doc.isbn[0], size: 'S' })}
            alt="book cover image"
          ></img>
        )}
      </li>
    </ul>
  );
}
