import axios from 'axios';
import { Doc, ScoredDoc, SearchResults, SortType } from './types';
import Constants from './constants';
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

function calculateKeywordScore(query: string, book: Doc) {
  const titleMatches = countMatches(query, book.title);

  const authorMatches =
    book.author_name?.reduce((acc, author) => {
      return acc + countMatches(query, author);
    }, 0) ?? 0;

  const subjectMatches =
    book.subject?.reduce((acc, subject) => {
      return acc + countMatches(query, subject);
    }, 0) ?? 0;

  const score = titleMatches * 3 + authorMatches * 2 + subjectMatches;

  return score;
}

function countMatches(query: string, text: string) {
  if (!query || !text) return 0;
  const queryWords = query.toLowerCase().split(' ');
  const textWords = text.toLowerCase().split(' ');

  return queryWords.reduce((count, word) => {
    return count + textWords.filter((textWord) => textWord === word).length;
  }, 0);
}

export function scoreDocs(query: string, docs: Doc[]) {
  const docsWithScores = docs.map((doc) => {
    const keyword = calculateKeywordScore(query, doc);
    const readlog = doc.readinglog_count ?? 0;
    const ratingcount = doc.ratings_count ?? 0;
    const relevance = keyword + readlog + ratingcount;

    return {
      ...doc,
      score: {
        keyword,
        readlog,
        ratingcount,
        relevance,
      },
    };
  });
  return docsWithScores;
}
export function sortDocs(
  scoredDocs: ScoredDoc[],
  sortType: SortType = 'relevance'
) {
  return sortType === 'none'
    ? scoredDocs
    : scoredDocs.sort((a, b) => {
        // const aScore = calculateRelevanceScore(query, a);
        // const bScore = calculateRelevanceScore(query, b);
        return b.score[sortType] - a.score[sortType];
      });
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

export function processRawResults(
  rawResults: SearchResults,
  submittedSearchText: string,
  sortType: SortType,
  filterSettings: FilterSettings
) {
  console.log(`processing results...`);

  const filteredDocs = filterDocs(rawResults.docs, filterSettings);

  const scoredDocs = scoreDocs(submittedSearchText, filteredDocs);

  const sortedDocs = sortDocs(scoredDocs, sortType);

  const sortedResults = { ...rawResults, docs: sortedDocs };

  return { sortedResults };
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === 'string')
  );
}

function isNumberArray(value: unknown): value is number[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === 'number')
  );
}

type AllowedDocKeys = keyof Doc;

function filterDoc(doc: Doc, activeFilters: FilterSettings) {
  return Object.entries(activeFilters).every(
    ([filterKey, filterOptionsArray]) => {
      if (filterKey in doc) {
        // ! why is docvalue possibly undefined if did filterkey in doc
        const docValue = doc[filterKey as AllowedDocKeys];

        return filterOptionsArray.every(([fval, isFiltered]) => {
          // filter is off
          if (isFiltered !== true) return true;

          // doc value is string array of values
          if (isStringArray(docValue)) {
            return docValue.includes(fval.toString());
          }

          // doc value is number array of values
          if (isNumberArray(docValue)) {
            return docValue.includes(Number(fval));
          }

          // doc value is single value
          const docvaltype = typeof docValue;
          switch (docvaltype) {
            case 'string':
              return doc[filterKey as AllowedDocKeys] === fval;
            case 'number':
              return doc[filterKey as AllowedDocKeys] === Number(fval);
            case 'boolean':
              return (
                doc[filterKey as AllowedDocKeys] ===
                (fval === 'true' ? true : false)
              );
          }
          return doc[filterKey as AllowedDocKeys] === fval;
        });
      }
      return true;
    }
  );
}

export function filterDocs(docs: Doc[], filterSettings: FilterSettings) {
  const activeFilters = { ...filterSettings };
  Object.entries(filterSettings).forEach(([key, valuesArray]) => {
    const activeValues = valuesArray.filter((boolPair) => boolPair[1] === true);
    activeFilters[key] = activeValues;
  });

  const filteredDocs = docs.filter((doc: Doc) => filterDoc(doc, activeFilters));
  // console.log(`filteredDocs`, filteredDocs);
  return filteredDocs;
}

export interface FilterEntries {
  [key: string]: Set<string | number | boolean>;
}

type FilterKeys = (typeof Constants.FILTER_KEYS)[number];

export type FilterSettings = {
  [K in FilterKeys]: Array<[string, boolean]>;
};

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

// Create a filter object containing values across all docs only for specified filter keys
export function initFilterSettings(docs: Doc[]) {
  const filterSettings: FilterSettings = {};
  docs.forEach((doc) => {
    Object.entries(doc).forEach(([key, value]) => {
      if (Constants.FILTER_KEYS.includes(key)) {
        // instantiate empty array as needed
        if (!filterSettings[key]) {
          filterSettings[key] = [];
        }

        // if doc's value for given key is an array, flatten it, only include new items from array
        if (Array.isArray(value)) {
          value.forEach((val) => {
            if (
              filterSettings[key].filter((v) => v[0] === val.toString())
                .length === 0
            ) {
              filterSettings[key].push([val.toString(), false]);
            }
          });

          // all other values, which can only be of a non-collection type: number, bool, string; only include new values
        } else {
          if (
            filterSettings[key].filter((val) => val[0] === value.toString())
              .length === 0
          ) {
            filterSettings[key].push([value.toString(), false]);
          }
        }
      }
    });
  });
  return filterSettings;
}
