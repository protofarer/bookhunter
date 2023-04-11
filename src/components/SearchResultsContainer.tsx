import { useEffect, useState } from 'react';
import { LoaderFunctionArgs, redirect, useLoaderData } from 'react-router-dom';
import Constants from '../constants';
import {
  FilterSettings,
  fetchData2,
  initFilterSettings,
  processRawResults,
} from '../util';
import { queryClient } from '../App';
import SearchBar from './SearchBar';
import ResultsList from './ResultsList';
import ResultsNav from './ResultsNav';
import type {
  SearchResults,
  SortType,
  LoaderData,
  SortedResults,
} from '../types';
import FilterContainer from './FilterContainer';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get('q');

  if (!q) {
    throw redirect('/');
  }

  // ! does await conflict with useNavigation.. IOW component won't load, thus
  // no navigation.state will be useless, since loader won't return until async
  // function resolves, rather than not waiting and allowing
  // react-router/component to handle a loading state
  const { data: rawResults, ttr }: { data: SearchResults; ttr: string } =
    await queryClient.fetchQuery(['results', q], () => fetchData2(q));

  const pageCount = Math.min(
    Math.ceil(rawResults.docs.length / Constants.RESULTS_PER_PAGE),
    Constants.RESULTS_MAX_PAGES
  );

  return { q, rawResults, ttr, pageCount };
};

export default function SearchResultsContainer() {
  const [sortType, setSortType] = useState<SortType>('relevance');
  const { q, rawResults, ttr, pageCount } = useLoaderData() as LoaderData<
    typeof loader
  >;
  const [sortedResults, setSortedResults] = useState<SortedResults | null>(
    null
  );

  const [filterSettings, setFilterSettings] = useState<FilterSettings>(
    initFilterSettings(rawResults.docs)
  );

  useEffect(() => {
    const { sortedResults } = processRawResults(
      rawResults,
      q,
      sortType,
      filterSettings
    );
    setSortedResults(sortedResults);
  }, [rawResults, sortType, filterSettings]);

  // const navigation = useNavigation();

  // const fetchData = async (limit?: number) => {
  //   return await fetchJsonFile(
  //     'http://localhost:5173/src/results.json',
  //     limit ?? 5
  //   );
  // };

  const [currentPage, setCurrentPage] = useState<number>(1);
  const docs = sortedResults?.docs.slice(
    (currentPage - 1) * Constants.RESULTS_PER_PAGE,
    currentPage * Constants.RESULTS_PER_PAGE
  );

  const onRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSortType(e.target.value as SortType);
  };

  const RadioRelevance = RadioSortSelectorFactory('relevance', onRadioChange);
  const RadioRating = RadioSortSelectorFactory('ratingcount', onRadioChange);
  const RadioKeyword = RadioSortSelectorFactory('keyword', onRadioChange);
  const RadioReading = RadioSortSelectorFactory('readlog', onRadioChange);

  function updateFilterSetting(
    key: string,
    property: string,
    isChecked: boolean
  ) {
    // console.log(
    //   `new filtersetting: key | property | isChecked`,
    //   key,
    //   property,
    //   isChecked
    // );
    setFilterSettings({
      ...filterSettings,
      [key]: { ...filterSettings[key], [property]: isChecked },
    });
  }

  return (
    <>
      {sortedResults ? (
        <div className="searchResultsPage">
          <SearchBar initSearchInput={q} />
          <div className="results">
            <div className="sortSelection">
              <span>Sort By: </span>
              <RadioRelevance currentSortType={sortType} />
              <RadioRating currentSortType={sortType} />
              <RadioKeyword currentSortType={sortType} />
              <RadioReading currentSortType={sortType} />
            </div>
            <div className="results-info">
              <>
                {sortedResults?.numFound} result
                {sortedResults?.numFound > 1 && 's'} | page {currentPage}/
                {pageCount} | {(parseInt(ttr) / 1000).toFixed(2)} seconds
              </>
            </div>
            <div className="results-list-filter">
              {docs && <ResultsList docs={docs} />}
              {filterSettings && (
                <FilterContainer
                  filterSettings={filterSettings}
                  updateFilterSetting={updateFilterSetting}
                />
              )}
            </div>
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
        q.length > 0 && <div>no results matched query </div>
      )}
    </>
  );
}

function RadioSortSelectorFactory(
  sortType: SortType,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
) {
  return function SortSelector({
    currentSortType,
  }: {
    currentSortType: SortType;
  }) {
    return (
      <span>
        <input
          checked={currentSortType === sortType}
          type="radio"
          id={sortType}
          name="sortType"
          value={sortType}
          onChange={onChange}
        />
        <label htmlFor={sortType}>
          {sortType.charAt(0).toUpperCase() + sortType.slice(1)}
        </label>
      </span>
    );
  };
}

// <input type="radio" id="relevance" name="sortType" value="relevance"
//   onChange={onRadioChange} />
// <label htmlFor="relevance">Relevance</label>

// <input type="radio" id="ratingcount" name="sortType" value="ratingcount"
//   onChange={onRadioChange} />
// <label htmlFor="ratingcount">Ratingcount</label>

// <input type="radio" id="keyword" name="sortType" value="keyword"
//   onChange={onRadioChange} />
// <label htmlFor="keyword">Keyword</label>

// <input type="radio" id="readlog" name="sortType" value="readlog"
//   onChange={onRadioChange} />
// <label htmlFor="readlog">Readlog</label>
