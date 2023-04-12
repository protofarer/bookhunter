import Constants from '../constants';
import { FilterSettings } from '../util';
import Filter from './Filter';

export default function FilterContainer({
  filterSettings,
  updateFilterSetting,
}: {
  filterSettings: FilterSettings;
  updateFilterSetting: (
    key: string,
    property: string,
    isChecked: boolean
  ) => void;
}) {
  return (
    <div className="results-filterContainer">
      {Constants.FILTER_KEYS.filter((x) => filterSettings?.[x]).map((key) => (
        <Filter
          key={key}
          filterKey={key}
          filterValuesArray={filterSettings[key]}
          updateFilterSetting={updateFilterSetting}
        />
      ))}

      {/* {filterSettings?.first_publish_year ? (
        <Filter
          filterKey="first_publish_year"
          filterValues={filterSettings.first_publish_year}
          updateFilterSetting={updateFilterSetting}
        />
      ) : (
        <span>no filters</span>
      )} */}
    </div>
  );
}
