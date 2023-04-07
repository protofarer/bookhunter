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
  console.log(`hello from root action`);

  const formData = await request.formData();
  for (const e of formData.entries()) {
    // console.log(`k:${k}  v:${v}` );
    console.log(`e`, e);
  }

  const q = formData.get('q') as string;
  const sortType = formData.get('sortType') as string;

  // ? CSDR form data need any more validation?

  return redirect(`/search?q=${q}&sortType=${sortType}`);
}
