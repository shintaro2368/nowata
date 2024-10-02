import { auth } from "@/auth";
import WorkComponent from "@/components/new/work-component";
import { redirect } from "next/navigation";

export default async function Works() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/");
  }

  return <WorkComponent />;
}
