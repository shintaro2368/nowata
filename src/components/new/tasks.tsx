"use client";

import Box from "@mui/material/Box";
import { Task } from "@prisma/client";
import { useState } from "react";
import TaskForm from "./task-form";
import TaskGrid from "./task-grid";

export default function Tasks({ tasks }: { tasks: Task[] }) {
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [displayForm, setDisplayForm] = useState(false);

  const handleOpenForm = () => {
    setDisplayForm(true);
  };

  const handleCloseForm = () => {
    setDisplayForm(false);
  };

  const handleSetEditTask = (task: Task) => {
    setEditTask(task);
    handleOpenForm();
  }

  return (
    <Box component="div" display="flex">
      <Box component="div" sx={{ width: "100%"}}>
        <TaskGrid
          tasks={tasks}
          handleOpenForm={handleOpenForm}
          isOpenForm={displayForm}
          handleSetEditTask={handleSetEditTask}
        />
      </Box>
      <Box component="div">
        {displayForm && (
          <TaskForm task={editTask} handleCloseForm={handleCloseForm} />
        )}
      </Box>
    </Box>
  );
}
