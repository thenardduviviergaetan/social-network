import { fetchUser } from '@/app/lib/data';

export default async function Page() {
  // const user = await fetchUser(); 

  return (

    <main>
      <h1 className='mb-4 text-xl md:text-2xl'>Home Page</h1>
    </main>
    // <div>
    //   <h1>You are logged in!</h1>
    //   <p>Name: {user?.nickname}</p> 
    //   <p>Email: {user?.email}</p> 
    // </div>
  );
}
