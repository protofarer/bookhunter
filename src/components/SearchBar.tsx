export default function SearchBar({
  onSubmit, onChange, searchText
} : {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchText: string;
}) {
  return (
    <form 
      className="searchForm"
      onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Search for books"
        value={searchText}
        onChange={onChange}
      />
      <button type="submit">
        🔍
      </button>
    </form>
  )


}