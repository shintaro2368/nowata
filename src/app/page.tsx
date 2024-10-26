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
      <div className="flex bg-white w-[600px] h-[300px] overflow-hidden rounded-lg shadow-xl">
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
          
          
          <div>
            <SignInGoogleButton />
            <SignInGithubButton />
          </div>
        </div>
      </div>
    </div>
  );
}
