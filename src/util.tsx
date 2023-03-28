import { Doc, SortType } from "./types";
export async function fetchJsonFile(fileUrl: string, limit?: number) {
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

function calculateKeywordScore(query: string, book: Doc) {
  console.log(`book`, book)
  
  const titleMatches = countMatches(query, book.title);

  const authorMatches = book.author_name?.reduce((acc, author) => {
    return acc + countMatches(query, author);
  }, 0) ?? 0;

  const subjectMatches = book.subject?.reduce((acc, subject) => {
    return acc + countMatches(query, subject);
  }, 0) ?? 0;

  const score =
    titleMatches * 3 +
    authorMatches * 2 +
    subjectMatches;

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

  return docsWithScores.sort((a, b) => {
    // const aScore = calculateRelevanceScore(query, a);
    // const bScore = calculateRelevanceScore(query, b);
    return b.score[sortType] - a.score[sortType];
  });
};