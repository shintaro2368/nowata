"use client";

import Box from "@mui/material/Box";
import { Task, Work } from "@prisma/client";
import { useState } from "react";
import TaskForm from "./task-form";
import TaskGrid from "./task-grid";
import TaskAndWorks from "@/types/task-and-works";
import Grid from "@mui/material/Grid"

export default function Tasks({ tasks }: { tasks: TaskAndWorks []}) {
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [displayForm, setDisplayForm] = useState(false);

  const handleOpenForm = () => {
    setEditTask(null);
    setDisplayForm(true);
  };

  const handleCloseForm = () => {
    setDisplayForm(false);
  };

  const handleSetEditTask = (task: Task) => {
    setEditTask(task);
    setDisplayForm(true)
  }

  return (
    <Grid container padding={2}>
      <Grid item xs={8}>
        <TaskGrid
          tasks={tasks}
          handleOpenForm={handleOpenForm}
          isOpenForm={displayForm}
          handleSetEditTask={handleSetEditTask}
        />
      </Grid>
      <Grid item xs={4}>
        {displayForm && (
          <Box position="sticky" width="100%" left={0} top={0}>
            <TaskForm task={editTask} handleCloseForm={handleCloseForm} />
          </Box>
        )}
      </Grid>
    </Grid>
  );
}
