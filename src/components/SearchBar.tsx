import { useEffect, useRef } from 'react';
import { Form } from 'react-router-dom';

export default function SearchBar({
  initSearchInput = '',
}: {
  initSearchInput: string;
}) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
      searchInputRef.current.value = initSearchInput;
    }
  }, []);

  // ? use for adv search
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchInputRef.current?.focus();
    }
  };

  return (
    <Form role="search" className="searchForm" method="post" action="/">
      <div className="searchForm-topbar">
        <input
          id="searchInput"
          name="q"
          type="search"
          placeholder="Find yet another book"
          ref={searchInputRef}
          required
          minLength={2}
          maxLength={150}
          aria-label="Search for a book"
        />
        <button type="submit">🔍</button>
      </div>
      <div className="searchForm-bottombar"></div>
    </Form>
  );
}
