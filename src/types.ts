type SearchInfo = {
  numFound: number;
  start: number;
  numFoundExact: boolean;
};
export type SearchResults = { docs: Doc[] } & SearchInfo;

export type Doc = {
  key: string;
  type: string;
  seed: string[];
  title: string;
  title_suggest: string;
  title_sort: string;
  edition_count: number;
  edition_key: string[];
  publish_date?: string[];
  publish_year: number[];
  first_publish_year: number;
  number_of_pages_median: number;
  publish_place?: string[];
  contributor?: string[];
  last_modified_i: number;
  ebook_count_i: number;
  ebook_access: string;
  has_fulltext: boolean;
  public_scan_b: boolean;
  readinglog_count: number;
  want_to_read_count: number;
  currently_reading_count: number;
  already_read_count: number;
  publisher: string[];
  language: string[];
  author_key: string[];
  author_name?: string[];
  author_alternative_name?: string[];
  subject?: string[];
  publisher_facet: string[];
  subject_facet: string[];
  _version_: number;
  author_facet: string[];
  subject_key: string[];
  lcc?: string[];
  isbn?: string[];
  ratings_count_1?: number;
  ratings_count_2?: number;
  ratings_count_3?: number;
  ratings_count_4?: number;
  ratings_count_5?: number;
  ratings_average?: number;
  ratings_sortable?: number;
  ratings_count?: number;
  cover_edition_key?: string;
  cover_i?: number;
  id_goodreads?: string[];
  id_librarything?: string[];
  lcc_sort?: string;
  ia?: string[];
  ia_collection?: string[];
  ia_collection_s?: string;
  printdisabled_s?: string;
};

export type SortType =
  | "keyword"
  | "readlog"
  | "ratingcount"
  | "relevance"
  | "none";

type SortInfo = {
  score: {
    keyword: string;
    readlog: number;
    ratingcount: number;
    relevance: number;
  };
  sortType: SortType;
};

type ScoredDoc = Doc & SortInfo;

export type SortedResults = SearchInfo & { docs: ScoredDoc[] };
