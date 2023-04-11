export default function Filter({
  filterKey,
  filterValues,
  updateFilterSetting,
}: {
  filterKey: string;
  filterValues: { [key: string]: boolean };
  updateFilterSetting: (
    key: string,
    property: string,
    isChecked: boolean
  ) => void;
}) {
  const values = Object.keys(filterValues);

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
          return (
            <div key={idx}>
              <input
                type="checkbox"
                name={filterKey}
                id={`${filterKey}-${val}`}
                value={val}
                onChange={onFilterChange}
              />
              <label htmlFor={`${filterKey}-${val}`}>{val}</label>
            </div>
          );
        })}
      </fieldset>
    </div>
  );
}
