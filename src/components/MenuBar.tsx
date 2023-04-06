import { useEffect, useState } from 'react';
import { SUBJECTS } from '../util';

export default function MenuBar() {
  const [subject, setSubject] = useState<string>('');

  useEffect(() => {
    const subject = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
    setSubject(subject);
  }, []);

  return (
    <nav id="menubar">
      <span>[Random book on {subject}]</span> <span>[user pref + log]</span>
    </nav>
  );
}
