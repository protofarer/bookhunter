import { useEffect, useState } from 'react';
import Constants from '../constants';

export default function MenuBar() {
  const [subject, setSubject] = useState<string>('');

  useEffect(() => {
    const subject =
      Constants.SUBJECTS[Math.floor(Math.random() * Constants.SUBJECTS.length)];
    setSubject(subject);
  }, []);

  return (
    <nav id="menubar">
      <span>[Random book on {subject}]</span> <span>[user pref + log]</span>
    </nav>
  );
}
