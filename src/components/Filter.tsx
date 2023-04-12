export default function Filter({
  filterKey,
  filterValuesArray,
  updateFilterSetting,
}: {
  filterKey: string;
  filterValuesArray: Array<[string, boolean]>;
  updateFilterSetting: (
    key: string,
    property: string,
    isChecked: boolean
  ) => void;
}) {
  function onFilterChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, checked } = e.target;
    console.log(`detect check click, name, val, checked`, name, value, checked);
    updateFilterSetting(name, value, checked);
  }

  return (
    <div className="results-filter">
      <legend>{filterKey}</legend>
      <fieldset>
        {filterValuesArray.map(([val, isChecked], idx) => {
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
