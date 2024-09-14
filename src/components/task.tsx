"use client";

import TaskList from "@/components/task-list";
import TaskForm from "@/components/task-form";
import WorkControle from "@/components/work-controle";
import { Task, Status, Work } from "@prisma/client";

import { useState } from "react";

export default function TaskComponent({
  tasks,
  statuses,
}: {
  tasks: (Task & { Work: Work[] })[];
  statuses: Status[];
}) {
  const [task, setTask] = useState<Task | null>(null);

  return (
    <>
      <div className="flex h-full">
        <div className="w-full">
          <TaskList
            tasks={tasks.map((task) => ({
              id: task.id,
              title: task.title,
              status: task.statusCode,
              description: task.description,
              action: (
                <WorkControle
                  taskId={task.id}
                  status={task.Work.length > 0 ? "running" : "none"}
                />
              ),
            }))}
          />
        </div>
        <div className="w-2/5 border-2 border-gray-200 shadow-lg rounded-md p-4 mx-4">
          <div className="flex flex-col">
            <div className="">
              <TaskForm
                statuses={statuses.map((status) => ({
                  code: status.code,
                  name: status.name,
                }))}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
