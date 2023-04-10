export default function ResultsNav({
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
