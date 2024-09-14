"use server";

import prisma from "@/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProject(data: FormData) {
  const session = await auth();
  const userId = session?.user?.id;

  const count = await prisma.project.count({ where: { userId: userId! } });
  if (count >= 10) {
    return { error: "You can only create up to 10 projects" };
  }

  await prisma.project.create({
    data: {
      title: data.get("title") as string,
      description: data.get("description") as string,
      userId: userId as string,
    },
  });
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateSelectProject(projectId: string) {
  const session = await auth();
  const userId = session?.user?.id;

  const oldSeldctProject = await prisma.project.findUnique({
    where: { selecterId: userId },
  });
  if (oldSeldctProject) {
    await prisma.project.update({
      where: { id: oldSeldctProject.id },
      data: { selecterId: null },
    });
  }
  await prisma.project.update({
    where: { id: projectId },
    data: { selecterId: userId },
  });
  revalidatePath("/dashboard");
}
