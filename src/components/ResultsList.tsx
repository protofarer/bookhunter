import ResultsItem from './ResultsItem';
import type { ScoredDoc } from '../types';

export default function ResultsList({ docs }: { docs: ScoredDoc[] | null }) {
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
