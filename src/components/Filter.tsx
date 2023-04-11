export default function Filter({
  filterKey,
  filterValues,
  updateFilterSetting,
}: {
  filterKey: string;
  filterValues: Set<string | number | boolean>;
  updateFilterSetting: (
    key: string,
    values: Set<string | number | boolean>
  ) => void;
}) {
  const values = new Array(...filterValues);

  function onFilterChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, checked } = e.target;
    console.log(`detect check click, name, val, checked`, name, value, checked);
    updateFilterSetting(name, value, checked);
  }

  return (
    <div className="results-filter">
      <legend>{filterKey}</legend>
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
                onChange={onFilterChange}
              />
              <label htmlFor={`${filterKey}-${sval}`}>{sval}</label>
            </div>
          );
        })}
      </fieldset>
    </div>
  );
}
