"use server";

import prisma from "@/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createTask(formData: FormData) {
  console.log("createTask", formData);
  const session = await auth();
  const user = session?.user;
  const project = await prisma.project.findUnique({
    where: { selecterId: user?.id },
  });
  if (!project) {
    throw new Error("Project not found");
  }
  const title = formData.get("title") as string;
  const description = formData.get("description") as string | null;
  const statusCode = formData.get("status") as string;
  await prisma.task.create({
    data: {
      title,
      description,
      projectId: project.id,
      statusCode,
    },
  });

  revalidatePath("/tasks");
}

export async function deleteTask(taskId: string) {
  await prisma.task.delete({ where: { id: taskId } });
  revalidatePath("/tasks");
}
