import type { ScoredDoc } from '../types';
import { makeCoverURL } from '../util/util';

export default function ResultsItem({ doc }: { doc: ScoredDoc }) {
  return (
    <ul className="resultsItem">
      <h2>{doc.title}</h2>
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
