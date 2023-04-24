import { FilterSetting } from '../util/filter';

export default function Filter({
  filterKey,
  filterSetting,
  updateFilterSetting,
}: {
  filterKey: string;
  filterSetting: FilterSetting;
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
        {filterSetting.map(([val, isChecked, nDocs], idx) => {
          return (
            <div key={idx}>
              <input
                type="checkbox"
                name={filterKey}
                id={`${filterKey}-${val}`}
                value={val}
                onChange={onFilterChange}
              />
              <label htmlFor={`${filterKey}-${val}`}>
                {val} ({nDocs})
              </label>
            </div>
          );
        })}
      </fieldset>
    </div>
  );
}
