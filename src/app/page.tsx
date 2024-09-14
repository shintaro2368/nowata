import Image from "next/image";
import { redirect } from "next/navigation";
import SignInGoogleButton from "@/components/sigin-google-buttn";
import SignInGithubButton from "@/components/signin-github-button";

import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="py-16 bg-gray-100 h-screen flex justify-center items-center">
      <div className="flex bg-white w-1/2 h-1/2 overflow-hidden rounded-lg shadow-xl">
        <div className="w-1/2 relative">
          <Image src="/top.png" alt="top" fill />
        </div>
        <div className="w-1/2 p-8">
          <h2 className="text-3xl font-semibold text-center text-gray">
            Nowata
          </h2>
          <p className="text-center text-gray-700 text-xl mt-4">
            Login to your account
          </p>
          <div className="mt-4">
            <label htmlFor="email" className="text-gray-700 text-sm mt-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full mt-2 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mt-4">
            <label htmlFor="password" className="text-gray-700 text-sm mt-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full mt-2 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mt-8">
            <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Login
            </button>
          </div>
          <div>
            <SignInGoogleButton />
            <SignInGithubButton />
          </div>
        </div>
      </div>
    </div>
  );
}
