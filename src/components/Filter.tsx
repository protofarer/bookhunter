export default function Filter({
  filterKey,
  filterValues,
}: {
  filterKey: string;
  filterValues: Set<string | number | boolean>;
}) {
  const values = new Array(...filterValues);
  return (
    <div className="results-filter">
      {filterKey}
      <fieldset>
        {values.map((val, idx) => {
          const sval = typeof val === 'string' ? val : val.toString();
          return (
            <div key={idx}>
              <input
                type="checkbox"
                name={filterKey}
                id={`${filterKey}-${sval}`}
                value={sval}
              />
              <label htmlFor={`${filterKey}-${sval}`}>{sval}</label>
            </div>
          );
        })}
      </fieldset>
    </div>
  );
}
