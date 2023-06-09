import { useEffect, useState } from 'react';
import { LoaderFunctionArgs, redirect, useLoaderData } from 'react-router-dom';
import Constants from '../constants';
import {
  calcPageCount,
  fetchData2,
  processResultsViewChange,
  scoreRawResults,
} from '../util/util';
import { queryClient } from '../App';
import SearchBar from './SearchBar';
import ResultsList from './ResultsList';
import ResultsNav from './ResultsNav';
import type {
  SearchResults,
  SortType,
  LoaderData,
  ScoredResults,
} from '../types';
import FilterContainer from './FilterContainer';
import { FilterSettings, initFilterSettings } from '../util/filter';

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

  const scoredResults = scoreRawResults(rawResults, q);

  return { q, scoredResults, ttr };
};

export default function SearchResultsContainer() {
  const [sortType, setSortType] = useState<SortType>('relevance');
  const [pageCount, setPageCount] = useState(0);
  const { q, scoredResults, ttr } = useLoaderData() as LoaderData<
    typeof loader
  >;
  const [processedResults, setProcessedResults] =
    useState<ScoredResults | null>(null);
  const [filterSettings, setFilterSettings] = useState<FilterSettings>(
    initFilterSettings(scoredResults.docs)
  );

  useEffect(() => {
    setProcessedResults(scoredResults);
    setFilterSettings(initFilterSettings(scoredResults.docs));
    setPageCount(pageCount);
  }, []);

  useEffect(() => {
    if (scoredResults) {
      const sortedFilteredResults = processResultsViewChange(
        scoredResults,
        sortType,
        filterSettings
      );
      const pageCount = calcPageCount(sortedFilteredResults);

      setProcessedResults({
        ...sortedFilteredResults,
        numFound: sortedFilteredResults.docs.length,
      });
      setPageCount(pageCount);
    }
  }, [sortType, filterSettings]);

  // const fetchData = async (limit?: number) => {
  //   return await fetchJsonFile(
  //     'http://localhost:5173/src/results.json',
  //     limit ?? 5
  //   );
  // };

  const [currentPage, setCurrentPage] = useState<number>(1);
  const docs = processedResults?.docs.slice(
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
    console.log(`filtersettings changed`);

    setFilterSettings({
      ...filterSettings,
      [key]: filterSettings[key].map((boolPair) =>
        boolPair[0] === property
          ? [boolPair[0], isChecked, boolPair[2]]
          : boolPair
      ),
    });
  }

  return (
    <>
      {processedResults ? (
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
                {processedResults?.numFound} result
                {processedResults?.numFound > 1 && 's'} | page {currentPage}/
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
