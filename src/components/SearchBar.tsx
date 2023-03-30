import { useEffect, useRef } from "react";
import { SortType } from "../types";

export default function SearchBar({
  setSortType, sortType, setSubmittedSearchText
} : {
  setSortType: (sortType: SortType) => void;
  sortType: SortType;
  setSubmittedSearchText: (submittedSearchText: string) => void;
}) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // ! tmp - this will not resort the data because queryFn has the sort logic
  const handleSearchSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!searchInputRef.current?.value) return;
    searchInputRef.current.select();
    setSubmittedSearchText(searchInputRef.current.value);
  };

  const onRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSortType(e.target.value as SortType);
    searchInputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchInputRef.current?.focus();
      handleSearchSubmit();
    }
  }

  // ? CSDR use array of sortTypes and map over it to produce the radio buttons
  const RadioRelevance = RadioSortSelectorFactory("relevance", onRadioChange, handleKeyDown);
  const RadioRating = RadioSortSelectorFactory("ratingcount", onRadioChange, handleKeyDown);
  const RadioKeyword = RadioSortSelectorFactory("keyword", onRadioChange, handleKeyDown);
  const RadioReading = RadioSortSelectorFactory("readlog", onRadioChange, handleKeyDown);

  return (
    <form 
      className="searchForm"
      onSubmit={handleSearchSubmit}
    >
      <div className="searchForm-topbar">
        <input
          id="searchInput"
          type="text"
          placeholder="Search for books"
          ref={searchInputRef}
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
  onKeyDown: React.KeyboardEventHandler<HTMLInputElement>
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
          onKeyDown={onKeyDown}
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