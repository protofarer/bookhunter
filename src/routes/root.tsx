import '../index.css';
import { Outlet } from 'react-router-dom';
import MenuBar from '../components/MenuBar';

export default function Root() {
  return (
    <>
      <header>
        <MenuBar />
      </header>
      <div id="main">
        <Outlet />
      </div>
      <div id="footer">- c 2023 KB -</div>
    </>
  );
}
