import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { Task } from "@prisma/client";
import TaskCard from "./task-card";
import TaskNew from "./task-new";

export default function TaskGrid({
  tasks,
  handleOpenForm,
  isOpenForm,
  handleSetEditTask,
}: {
  tasks: Task[];
  handleOpenForm: () => void;
  isOpenForm: boolean;
  handleSetEditTask: (task: Task) => void;
}) {
  return (
    <Container>
      <Grid
        container
        rowSpacing={2}
        columnSpacing={2}
        maxWidth={1200}
        margin={4}
      >
        {tasks.map((task) => (
          <Grid item xs={4}>
            <TaskCard task={task} onClick={handleSetEditTask} />
          </Grid>
        ))}
        <Grid item xs={4}>
          <TaskNew onClick={handleOpenForm} disable={isOpenForm} />
        </Grid>
      </Grid>
    </Container>
  );
}
