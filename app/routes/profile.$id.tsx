import { redirect, useLoaderData } from "@remix-run/react";
import { findUser, User } from "~/data/users";

type Props = {};

/**
 * Required loader function
 * for remix to fetch data from backend
 * return to the front end
 * @param param0 params from $id
 * @returns user object
 */
export function loader({ params }: { params: { id: string } }) {
  const user = findUser(params.id);
  if (!user) {
    /**
     * only in server
     * like actions, loaders can return a redirect response
     */
    return redirect("/not-found");
  }
  return new Response(JSON.stringify(user), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function Profile({}: Props) {
  // data comes from the loader functions
  const user = useLoaderData<User>();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 ">
          Welcome, {user.name}
        </h1>
        <p className="text-gray-600 mt-2">Email: {user.email} </p>
        <div className="mt-6 flex space-x-4">
          {/* information for logout, delete etc  */}
        </div>
      </div>
    </div>
  );
}
export default Profile;
