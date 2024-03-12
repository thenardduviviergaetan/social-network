import { fetchUser } from '@/app/lib/data';

export default async function Page() {
  const user = await fetchUser(); 

  return (
    <div>
      <h1>You are logged in!</h1>
      <p>Name: {user?.nickname}</p> {/* Display user's name */}
      <p>Email: {user?.email}</p> {/* Display user's email */}
      {/* Add more user information as needed */}
    </div>
  );
}
