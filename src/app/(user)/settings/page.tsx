import { createSetting } from "@/actions/setting-action";
import { auth } from "@/auth";
import SettingsForm from "@/components/settings-form";
import prisma from "@/db";

export default async function SettingsPage() {
  const session = await auth();
  const user = session?.user;
  if (!user?.id) {
    throw new Error("ログインしてください");
  }

  const project = await prisma.project.findUnique({
    where: { selecterId: user.id },
  });

  let setting;
  setting = await prisma.setting.findUnique({
    where: { userId: user.id },
  });

  if (!project) {
    // TODO プロジェクト作成の案内＆リダイレクト
    return;
  }

  if (!setting) {
    setting = await createSetting();
  }

  return <SettingsForm settingFormProps={{ user, project, setting }} />;
}
