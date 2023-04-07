import SearchBar from '../components/SearchBar';

export default function Index() {
  return (
    <div className="soleCenter">
      <h1 style={{ textAlign: 'center' }}>YABF</h1>
      <SearchBar initSearchInput={''} />
    </div>
  );
}
