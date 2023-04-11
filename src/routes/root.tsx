import '../index.css';
import { ActionFunctionArgs, Outlet, redirect } from 'react-router-dom';
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

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const q = formData.get('q') as string;
  return redirect(`/search?q=${q}`);
}
