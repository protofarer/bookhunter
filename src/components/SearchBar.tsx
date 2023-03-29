import { SortType } from "../types";

export default function SearchBar({
  onSubmit, onChange, searchText, setSortType, sortType,
} : {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchText: string;
  setSortType: (sortType: SortType) => void;
  sortType: SortType;
}) {
  const onRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSortType(e.target.value as SortType);
  };

  const RadioRelevance = RadioSortSelectorFactory("relevance", onRadioChange);
  const RadioRating = RadioSortSelectorFactory("ratingcount", onRadioChange);
  const RadioKeyword = RadioSortSelectorFactory("keyword", onRadioChange);
  const RadioReading = RadioSortSelectorFactory("readlog", onRadioChange);

  return (
    <form 
      className="searchForm"
      onSubmit={onSubmit}
    >
      <div className="searchForm-topbar">
        <input
          id="searchInput"
          type="text"
          placeholder="Search for books"
          value={searchText}
          onChange={onChange}
        />
        <button type="submit">
          🔍
        </button>
      </div>
      <div className="searchForm-bottombar">
        <span>Search By: </span>
        <RadioRelevance currentSortType={sortType} />
        <RadioRating currentSortType={sortType} />
        <RadioKeyword currentSortType={sortType} />
        <RadioReading currentSortType={sortType} />

      </div>
    </form>
  )
}

function RadioSortSelectorFactory(
  sortType: SortType, 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, 
) {
  return function SortSelector({ currentSortType }: { currentSortType: SortType }) {
    return (
      <span>
        <input 
          checked={currentSortType === sortType} 
          type="radio" id={sortType} 
          name="sortType" 
          value={sortType}
          onChange={onChange} 
        />
        <label htmlFor={sortType}>{sortType.charAt(0).toUpperCase() + sortType.slice(1)}</label>
      </span>
    )
  }
}


        // <input type="radio" id="relevance" name="sortType" value="relevance" 
        //   onChange={onRadioChange} />
        // <label htmlFor="relevance">Relevance</label>

        // <input type="radio" id="ratingcount" name="sortType" value="ratingcount"
        //   onChange={onRadioChange} />
        // <label htmlFor="ratingcount">Ratingcount</label>

        // <input type="radio" id="keyword" name="sortType" value="keyword"
        //   onChange={onRadioChange} />
        // <label htmlFor="keyword">Keyword</label>

        // <input type="radio" id="readlog" name="sortType" value="readlog"
        //   onChange={onRadioChange} />
        // <label htmlFor="readlog">Readlog</label>