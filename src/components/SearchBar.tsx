import { useEffect, useRef } from "react";
import { SortType } from "../types";

export default function SearchBar({
  onSubmit, onChange, searchText, setSortType, sortType
} : {
  onSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchText: string;
  setSortType: (sortType: SortType) => void;
  sortType: SortType;
}) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const onRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSortType(e.target.value as SortType);
      searchInputRef?.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log(`keypress input radio`, )
    
    if (e.key === 'Enter') {
      console.log(`detect enter, form submit`, )
      e.preventDefault();
      searchInputRef?.current?.focus();
      onSubmit();
    }
  }

  const RadioRelevance = RadioSortSelectorFactory("relevance", onRadioChange, handleKeyDown);
  const RadioRating = RadioSortSelectorFactory("ratingcount", onRadioChange, handleKeyDown);
  const RadioKeyword = RadioSortSelectorFactory("keyword", onRadioChange, handleKeyDown);
  const RadioReading = RadioSortSelectorFactory("readlog", onRadioChange, handleKeyDown);


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