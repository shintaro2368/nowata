import { signIn } from "@/auth";

export default function SignInGithubButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("github", { redirectTo: "/dashboard" });
      }}
    >
      <button type="submit">Login with Github</button>
    </form>
  );
}
