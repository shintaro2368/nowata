import { signIn } from "@/auth";

export default function SignInGoogleButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: "/dashboard" });
      }}
    >
      <button type="submit">Login with Google</button>
    </form>
  );
}
