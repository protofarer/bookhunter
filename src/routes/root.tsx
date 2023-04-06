import { useEffect, useState } from 'react';
import { SUBJECTS } from '../util';
import '../index.css';
import { Outlet } from 'react-router-dom';

export default function Root() {
  const [subject, setSubject] = useState<string>('');

  useEffect(() => {
    const subject = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
    setSubject(subject);
  }, []);

  return (
    <>
      <div id="menubar">
        <span>[Random book on {subject}]</span> <span>[user pref + log]</span>
      </div>
      <div id="main">
        <Outlet />
      </div>
      <div id="footer">- c 2023 KB -</div>
    </>
  );
}
