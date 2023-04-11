import Constants from '../constants';
import { FilterEntries } from '../util';
import Filter from './Filter';

export default function FiltersContainer({
  filtersEntries,
  updateFilterSetting,
}: {
  filtersEntries: FilterEntries;
  updateFilterSetting: (
    key: string,
    values: Set<number | string | boolean>
  ) => void;
}) {
  return (
    <div className="results-filterContainer">
      {filtersEntries &&
        Constants.FILTER_KEYS.filter((x) => filtersEntries?.[x]).map((key) => (
          <Filter
            key={key}
            filterKey={key}
            filterValues={filtersEntries[key]}
            updateFilterSetting={updateFilterSetting}
          />
        ))}

      {filtersEntries?.first_publish_year ? (
        <Filter
          filterKey="first_publish_year"
          filterValues={filtersEntries.first_publish_year}
          updateFilterSetting={updateFilterSetting}
        />
      ) : (
        <span>no filters</span>
      )}
    </div>
  );
}
