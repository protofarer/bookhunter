import { useEffect, useRef, useState } from 'react';
import { SortType } from '../types';
import { useSubmit } from 'react-router-dom';

export default function SearchBar() {
  const [submittedSearchText, setSubmittedSearchText] = useState('');
  const [sortType, setSortType] = useState<SortType>('relevance');
  const submit = useSubmit();

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!searchInputRef.current?.value) return;
    searchInputRef.current.select();
    setSubmittedSearchText(searchInputRef.current.value);

    // TODO navigate to results route
    submit(null, {
      action: '/search',
      method: 'post',
    });
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
  };

  // ? CSDR use array of sortTypes and map over it to produce the radio buttons
  const RadioRelevance = RadioSortSelectorFactory(
    'relevance',
    onRadioChange,
    handleKeyDown
  );
  const RadioRating = RadioSortSelectorFactory(
    'ratingcount',
    onRadioChange,
    handleKeyDown
  );
  const RadioKeyword = RadioSortSelectorFactory(
    'keyword',
    onRadioChange,
    handleKeyDown
  );
  const RadioReading = RadioSortSelectorFactory(
    'readlog',
    onRadioChange,
    handleKeyDown
  );

  return (
    <form className="searchForm" onSubmit={handleSearchSubmit}>
      <div className="searchForm-topbar">
        <input
          id="searchInput"
          name="searchInput"
          type="text"
          placeholder="Find yet another book"
          ref={searchInputRef}
        />
        <button type="submit">🔍</button>
      </div>
      <div className="searchForm-bottombar">
        <span>Sort By: </span>
        <RadioRelevance currentSortType={sortType} />
        <RadioRating currentSortType={sortType} />
        <RadioKeyword currentSortType={sortType} />
        <RadioReading currentSortType={sortType} />
      </div>
    </form>
  );
}

function RadioSortSelectorFactory(
  sortType: SortType,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onKeyDown: React.KeyboardEventHandler<HTMLInputElement>
) {
  return function SortSelector({
    currentSortType,
  }: {
    currentSortType: SortType;
  }) {
    return (
      <span>
        <input
          checked={currentSortType === sortType}
          type="radio"
          id={sortType}
          name="sortType"
          value={sortType}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
        <label htmlFor={sortType}>
          {sortType.charAt(0).toUpperCase() + sortType.slice(1)}
        </label>
      </span>
    );
  };
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
