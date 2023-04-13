import Constants from '../constants';
import { Doc } from '../types';

export interface FilterEntries {
  [key: string]: Set<string | number | boolean>;
}
export type FilterSetting = Array<[string, boolean, number]>;

type FilterKeys = (typeof Constants.FILTER_KEYS)[number];

export type FilterSettings = {
  [K in FilterKeys]: FilterSetting;
};

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === 'string')
  );
}

function isNumberArray(value: unknown): value is number[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === 'number')
  );
}

function filterDoc(doc: Doc, activeFilters: FilterSettings) {
  return Object.entries(activeFilters).every(
    ([filterKey, filterOptionsArray]) => {
      if (filterKey in doc) {
        // ! why is docvalue possibly undefined if did filterkey in doc
        type AllowedDocKeys = keyof Doc;
        const docValue = doc[filterKey as AllowedDocKeys];

        return filterOptionsArray.every(([fval, isFiltered]) => {
          // filter is off
          if (isFiltered !== true) return true;

          // doc value is string array of values
          if (isStringArray(docValue)) {
            return docValue.includes(fval.toString());
          }

          // doc value is number array of values
          if (isNumberArray(docValue)) {
            return docValue.includes(Number(fval));
          }

          // doc value is single value
          const docvaltype = typeof docValue;
          switch (docvaltype) {
            case 'string':
              return doc[filterKey as AllowedDocKeys] === fval;
            case 'number':
              return doc[filterKey as AllowedDocKeys] === Number(fval);
            case 'boolean':
              return (
                doc[filterKey as AllowedDocKeys] ===
                (fval === 'true' ? true : false)
              );
          }
          return doc[filterKey as AllowedDocKeys] === fval;
        });
      }
      return true;
    }
  );
}

export function filterDocs(docs: Doc[], filterSettings: FilterSettings) {
  const activeFilters = { ...filterSettings };
  Object.entries(filterSettings).forEach(([key, valuesArray]) => {
    const activeValues = valuesArray.filter((boolPair) => boolPair[1] === true);
    activeFilters[key] = activeValues;
  });

  const filteredDocs = docs.filter((doc: Doc) => filterDoc(doc, activeFilters));
  // console.log(`filteredDocs`, filteredDocs);
  return filteredDocs;
}

// Create a filter object containing values across all docs only for specified filter keys
export function initFilterSettings(docs: Doc[]) {
  // TODO need to identify all filter keys present in results first so that docs without a given filter key (as a doc prop) may be tallied under 'unknown'
  // alternatively, do this tally after the filterkey sweep below
  const filterSettings: FilterSettings = {};
  Constants.FILTER_KEYS.forEach((filterKey) => {
    filterSettings[filterKey] = [];

    docs.forEach((doc) => {
      type AllowedDocKeys = keyof Doc;
      const docValue = doc[filterKey as AllowedDocKeys];

      if (docValue) {
        if (Array.isArray(docValue)) {
          docValue.forEach((val) => {
            if (
              filterSettings[filterKey].filter((v) => v[0] === val.toString())
                .length === 0
            ) {
              filterSettings[filterKey].push([val.toString(), false, 1]);
            } else {
              filterSettings[filterKey] = filterSettings[filterKey].map(
                (setting) =>
                  setting[0] === val.toString()
                    ? [setting[0], setting[1], setting[2] + 1]
                    : setting
              );
            }
          });

          // all other values, which can only be of a non-collection type: number, bool, string; only include new values
        } else {
          if (
            filterSettings[filterKey].filter(
              (fval) => fval[0] === docValue.toString()
            ).length === 0
          ) {
            filterSettings[filterKey].push([docValue.toString(), false, 1]);
          } else {
            filterSettings[filterKey] = filterSettings[filterKey].map(
              (setting) =>
                setting[0] === docValue.toString()
                  ? [setting[0], setting[1], setting[2] + 1]
                  : setting
            );
          }
        }
      } else {
        if (
          filterSettings[filterKey].filter(
            (x) => x[0] === Constants.FILTER_KEY_VALUE_WHEN_ABSENT_FROM_DOC
          ).length === 0
        ) {
          filterSettings[filterKey].push(['unknown', false, 1]);
        } else {
          filterSettings[filterKey] = filterSettings[filterKey].map((setting) =>
            setting[0] === Constants.FILTER_KEY_VALUE_WHEN_ABSENT_FROM_DOC
              ? [setting[0], setting[1], setting[2] + 1]
              : setting
          );
        }
      }
    });
  });
  // docs.forEach((doc) => {
  //   Object.entries(doc).forEach(([key, value]) => {
  //     if (Constants.FILTER_KEYS.includes(key)) {
  //       // instantiate empty array as needed
  //       // if doc's value for given key is an array, flatten it, only include new items from array
  //       if (Array.isArray(value)) {
  //         value.forEach((val) => {
  //           if (
  //             filterSettings[key].filter((v) => v[0] === val.toString())
  //               .length === 0
  //           ) {
  //             filterSettings[key].push([val.toString(), false, 1]);
  //           } else {
  //             filterSettings[key] = filterSettings[key].map((setting) =>
  //               setting[0] === val.toString()
  //                 ? [setting[0], setting[1], setting[2] + 1]
  //                 : setting
  //             );
  //           }
  //         });

  //         // all other values, which can only be of a non-collection type: number, bool, string; only include new values
  //       } else {
  //         if (
  //           filterSettings[key].filter((val) => val[0] === value.toString())
  //             .length === 0
  //         ) {
  //           filterSettings[key].push([value.toString(), false, 1]);
  //         } else {
  //           filterSettings[key] = filterSettings[key].map((setting) =>
  //             setting[0] === value.toString()
  //               ? [setting[0], setting[1], setting[2] + 1]
  //               : setting
  //           );
  //         }
  //       }
  //     }
  // else {
  //   if (
  //     filterSettings[key].filter(
  //       (x) => x[0] === Constants.FILTER_KEY_VALUE_WHEN_ABSENT_FROM_DOC
  //     ).length === 0
  //   ) {
  //     filterSettings[key].push(['unknown', false, 1]);
  //   } else {
  //     filterSettings[key] = filterSettings[key].map((setting) =>
  //       setting[0] === Constants.FILTER_KEY_VALUE_WHEN_ABSENT_FROM_DOC
  //         ? [setting[0], setting[1], setting[2] + 1]
  //         : setting
  //     );
  //   }
  // }
  // });
  // });
  return filterSettings;
}
