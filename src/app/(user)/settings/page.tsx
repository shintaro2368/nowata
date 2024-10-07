import { auth } from "@/auth";
import SettingsForm from "@/components/settings-form";
import prisma from "@/db";

export default async function SettingsPage() {
  const session = await auth();
  const user = session?.user;
  if (!user?.id) {
    return;
  }

  const project = await prisma.project.findUnique({
    where: { selecterId: user.id },
    include: { Setting: true },
  });

  if (!project) {
    // TODO プロジェクト作成の案内＆リダイレクト
    return;
  }

  const setting = project.Setting!!;
  return <SettingsForm settingFormProps={{ user, project, setting }} />;
}
