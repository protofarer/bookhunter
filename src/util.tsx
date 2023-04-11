import axios from 'axios';
import { Doc, SearchResults, SortType } from './types';
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

export function sortDocsBySortType(
  query: string,
  docs: Doc[],
  sortType: SortType = 'relevance'
) {
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
      sortType,
    };
  });

  return sortType === 'none'
    ? docsWithScores
    : docsWithScores.sort((a, b) => {
        // const aScore = calculateRelevanceScore(query, a);
        // const bScore = calculateRelevanceScore(query, b);
        return b.score[sortType] - a.score[sortType];
      });
}

const SUBJECTS = [
  'Architecture',
  'Art Instruction',
  'Art History',
  'Dance',
  'Design',
  'Fashion',
  'Film',
  'Graphic Design',
  'Music',
  'Music Theory',
  'Painting',
  'Photography',
  'Bears',
  'Cats',
  'Kittens',
  'Dogs',
  'Puppies',
  'Fantasy',
  'Historical Fiction',
  'Horror',
  'Humor',
  'Literature',
  'Magic',
  'Mystery and detective stories',
  'Plays',
  'Poetry',
  'Romance',
  'Science Fiction',
  'Short Stories',
  'Thriller',
  'Young Adult',
  'Biology',
  'Chemistry',
  'Mathematics',
  'Physics',
  'Programming',
  'Management',
  'Entrepreneurship',
  'Business Economics',
  'Business Success',
  'Finance',
  'Kids Books',
  'Stories in Rhyme',
  'Baby Books',
  'Bedtime Books',
  'Picture Books',
  'Ancient Civilization',
  'Archaeology',
  'Anthropology',
  'World War II',
  'Social Life and Customs',
  'Cooking',
  'Cookbooks',
  'Mental Health',
  'Exercise',
  'Nutrition',
  'Self-help',
  'Autobiographies',
  'History',
  'Politics and Government',
  'World War II',
  'Women',
  'Kings and Rulers',
  'Composers',
  'Artists',
  'Anthropology',
  'Religion',
  'Political Science',
  'Psychology',
  'Brazil',
  'India',
  'Indonesia',
  'United States',
  'History',
  'Mathematics',
  'Geography',
  'Psychology',
  'Algebra',
  'Education',
  'Business & Economics',
  'Science',
  'Chemistry',
  'English Language',
  'Physics',
  'Computer Science',
  'English',
  'French',
  'Spanish',
  'German',
  'Russian',
  'Italian',
  'Chinese',
  'Japanese',
];

export { SUBJECTS };

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
  type AllowedDocKeys = keyof Doc;
  function isArray<T>(value: any): value is T[] {
    return Array.isArray(value);
  }

  const filteredDocs = rawResults.docs.filter((doc: Doc) => {
    // TODO MAKE THIS WORK
    return Object.entries(filterSettings).every(
      ([filterKey, filterOptionsObject]) => {
        if (filterKey in doc) {
          const docValue = doc[filterKey as AllowedDocKeys];

          Object.entries(filterOptionsObject).every(([propVal, isFiltered]) => {
            if (isFiltered !== true) return true;
            if (isArray<typeof propVal>(docValue)) {
              return docValue.includes(propVal);
            }
            return doc[filterKey as AllowedDocKeys] === propVal;
          });
        }
        return true;
      }
    );
  });
  console.log(`filteredDocs`, filteredDocs);

  const scoredSortedDocs = sortDocsBySortType(
    submittedSearchText,
    rawResults.docs,
    sortType
  );
  const sortedResults = { ...rawResults, docs: scoredSortedDocs };
  return { sortedResults };
}

export interface FilterEntries {
  [key: string]: Set<string | number | boolean>;
}

type FilterKeys = (typeof Constants.FILTER_KEYS)[number];

export type FilterSettings = {
  [K in FilterKeys]: Record<string, boolean>;
};

// Creates a filter object with all the possible values for each filter
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

export function initFilterSettings(docs: Doc[]) {
  // this function will create a filter object only for document properties present in Constants.FILTER_KEYS
  const filters: FilterSettings = {};
  docs.forEach((doc) => {
    Object.entries(doc).forEach(([k, v]) => {
      if (Constants.FILTER_KEYS.includes(k)) {
        if (!filters[k]) {
          filters[k] = {};
        }
        if (Array.isArray(v)) {
          v.forEach((x) => (filters[k][x.toString()] = false));
        } else {
          filters[k][v.toString()] = false;
        }
      }
    });
  });
  return filters;
}
