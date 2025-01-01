import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { Form, useActionData, useNavigate } from "@remix-run/react";
import { addUser, findUserByEmailPassword, User } from "~/data/users";
import { v4 as uuidv4 } from "uuid";
import { useEffect } from "react";

type ActionDataType = {
  error?: string;
  user?: User;
};

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const action: ActionFunction = async ({
  request,
}: {
  request: Request;
}) => {
  const formData = await request.formData();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // API request
  if (!email || !password) {
    return Response.json(
      {
        error: "Email and password are required",
      },
      {
        status: 400,
      }
    );
  }
  // created new user object
  const newUser: User = {
    id: uuidv4(),
    name: "New User",
    email,
    password,
  };
  const existingUser = findUserByEmailPassword(email, password);

  const user = existingUser ?? newUser;
  if (!existingUser) {
    addUser(user);
  }

  return Response.json({ user }, { status: 200 });
};

export default function Index() {
  const actionData = useActionData<ActionDataType>();
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData: User = JSON.parse(user);
      // navigate(`/profile/${JSON.stringify(userData.id)}`);
      location.pathname = `/profile/${userData.id}`;
    }
    if (actionData?.user) {
      localStorage.setItem("user", JSON.stringify(actionData.user));
      navigate(`/profile/${actionData.user.id}`);
    }
  }, [actionData, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center  bg-gradient-to-br from-blue-500 to-blue-700 ">
      <div className=" bg-white w-full max-w-md p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800">Login</h1>
        <Form method="post" className="space-y-6 mt-6 text-black bg-none">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="mt-2 block
          w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border focus:border-gray-600 bg-white "
            type="email"
            name="email"
            id="email"
          />

          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="mt-2 block
          w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border focus:border-gray-600 bg-white "
            type="password"
            name="password"
            id="password"
          />

          <button
            className="border border-black px-6 py-4 bg-black text-white"
            type="submit"
          >
            Login
          </button>
        </Form>
      </div>
    </div>
  );
}
