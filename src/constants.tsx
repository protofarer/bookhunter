// interface IConstants {
//   RESULTS_PER_PAGE: number;
//   RESULTS_MAX_PAGES: number;
// }

const Constants = {
  RESULTS_PER_PAGE: 5,
  RESULTS_MAX_PAGES: 3,
  FILTER_KEYS: [
    'ebook_access',
    'first_publish_year',
    'language',
    'publisher',
    'ratings_average',
    'subject',
  ],
  FILTER_KEY_VALUE_WHEN_ABSENT_FROM_DOC: 'unknown',
};

export default Constants;
