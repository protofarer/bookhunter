import { useEffect, useState } from 'react';
import { SUBJECTS } from '../util';
import '../App.css';
import SearchBar from '../components/SearchBar';
import { Outlet } from 'react-router-dom';

export default function Root() {
  const [subject, setSubject] = useState<string>('');

  useEffect(() => {
    const subject = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
    setSubject(subject);
  }, []);

  return (
    <div className="App">
      <div className="homebar">
        <span>YABF </span>
        <span>[Random book on {subject}]</span> <span>[user pref + log]</span>
      </div>
      <SearchBar />
      <Outlet />
      <div id="footer"></div>
    </div>
  );
}
