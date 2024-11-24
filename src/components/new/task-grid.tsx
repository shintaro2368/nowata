import TaskAndWorks from "@/types/task-and-works";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { SubTask, Task } from "@prisma/client";
import TaskCard from "./task-card";
import TaskNew from "./task-new";
import { useAtomValue } from "jotai";
import { taskInfosAtom } from "@/state";

export default function TaskGrid() {
  const taskInfosValue = useAtomValue(taskInfosAtom);

  return (
    <Container>
      <Grid
        container
        spacing={2}
      >
        {taskInfosValue.map((task) => (
          <Grid item xs={4} key={task.id}>
            <TaskCard key={task.id} task={task}/>
          </Grid>
        ))}
        <Grid item xs={4}>
          <TaskNew />
        </Grid>
      </Grid>
    </Container>
  );
}
