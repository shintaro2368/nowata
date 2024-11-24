"use client";

import { displayTaskFormAtom, taskInfosAtom, editTaskAtom } from "@/state";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { SubTask, Task, Work } from "@prisma/client";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import TaskForm from "./task-form";
import TaskGrid from "./task-grid";

export default function Tasks({
  tasks,
}: {
  tasks: (Task & { Work: Work[]; SubTask: SubTask[] })[];
}) {
  const displayTaskFormValue = useAtomValue(displayTaskFormAtom);
  const setTaskInfosValue = useSetAtom(taskInfosAtom);
  const setEidtTaskValue = useSetAtom(editTaskAtom);

  useEffect(() => {
    setTaskInfosValue([...tasks]);
    setEidtTaskValue((prev) => {
      if(prev) {
        const newEditTaskValue = tasks.find(t => t.id === prev.id);
        return newEditTaskValue ?? null;
      }
      return null;
    })
  }, [tasks]);

  return (
    <Grid container padding={2}>
      <Grid item xs={8}>
        <TaskGrid />
      </Grid>
      <Grid item xs={4}>
        {displayTaskFormValue && (
          <Box position="sticky" width="100%" left={0} top={0}>
            <TaskForm />
          </Box>
        )}
      </Grid>
    </Grid>
  );
}
