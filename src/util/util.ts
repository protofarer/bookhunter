import axios from 'axios';
import { Doc, ScoredResults, SearchResults, SortType } from '../types';
import Constants from '../constants';
import { FilterEntries, FilterSettings, filterDocs } from './filter';
import { scoreDocs, sortDocs } from './sort';
export async function fetchJsonFile(fileUrl: string, limit?: number) {
  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const jsonObject = (await response.json()) as SearchResults;

    return {
      ...jsonObject,
      docs: limit ? jsonObject.docs.slice(0, limit) : jsonObject.docs,
    };
  } catch (error) {
    console.error('Error fetching JSON file:', error);
    return null;
  }
}

type IMakeCoverURL = {
  key: 'isbn' | 'lccn' | 'oclc' | 'olid' | 'id';
  value: string;
  size: 'S' | 'M' | 'L';
};

export function makeCoverURL(props: IMakeCoverURL) {
  return `https://covers.openlibrary.org/b/${props.key}/${props.value}-${props.size}.jpg`;
}

export async function fetchData2(submittedSearchText: string) {
  const ttrStart = performance.now();
  const { data }: { data: SearchResults } = await axios(
    `https://openlibrary.org/search.json?q=${submittedSearchText}&limit=${
      Constants.RESULTS_MAX_PAGES * Constants.RESULTS_PER_PAGE
    }`
  );

  const ttr = performance.now() - ttrStart;
  return { data, ttr };
}

export function scoreRawResults(
  rawResults: SearchResults,
  submittedSearchText: string
) {
  const scoredDocs = scoreDocs(submittedSearchText, rawResults.docs);

  const scoredResults = { ...rawResults, docs: scoredDocs };

  return scoredResults;
}

export function calcPageCount(scoredResults: ScoredResults) {
  const pageCount = scoredResults
    ? Math.min(
        Math.ceil(scoredResults.docs.length / Constants.RESULTS_PER_PAGE),
        Constants.RESULTS_MAX_PAGES
      )
    : 0;
  return pageCount;
}

export function processResultsViewChange(
  results: ScoredResults,
  sortType: SortType,
  filterSettings: FilterSettings
) {
  const filteredDocs = filterDocs(results.docs, filterSettings);
  const sortedFilteredDocs = sortDocs(filteredDocs, sortType);
  return { ...results, docs: sortedFilteredDocs };
}

// Creates a filter object containing values across all docs for all doc keys
export function concatDocProps(docs: Doc[]): FilterEntries {
  const filters: FilterEntries = {};
  docs.forEach((doc) => {
    Object.entries(doc).forEach(([k, v]) => {
      // console.log(`k:${k} typeof v: ${typeof v}`);
      // console.log(`v`, v);
      if (!filters[k]) {
        filters[k] = new Set();
      }
      if (Array.isArray(v)) {
        v.forEach((x) => filters[k].add(x));
      } else {
        filters[k].add(v);
      }
    });
  });
  // console.log(filters);
  return filters;
}
