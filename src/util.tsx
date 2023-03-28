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

function calculateRelevanceScore(query, book) {
  const titleMatches = countMatches(query, book.title);
  const authorMatches = countMatches(query, book.author);
  const descriptionMatches = countMatches(query, book.description);

  const score =
    titleMatches * 3 +
    authorMatches * 2 +
    descriptionMatches;

  return score;
}

function countMatches(query, text) {
  if (!text) return 0;
  const queryWords = query.toLowerCase().split(' ');
  const textWords = text.toLowerCase().split(' ');

  return queryWords.reduce((count, word) => {
    return count + textWords.filter((textWord) => textWord === word).length;
  }, 0);
}

export function sortResultsByRelevance(query, results) {
  return results.sort((a, b) => {
    const aScore = calculateRelevanceScore(query, a);
    const bScore = calculateRelevanceScore(query, b);

    return bScore - aScore;
  });
}

// Example usage
// const query = 'science fiction';
// const results = []; // Replace with search results from the Open Library API
// const sortedResults = sortResultsByRelevance(query, results);
