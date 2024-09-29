import { createTask, updateTask } from "@/actions/task-action";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { grey } from "@mui/material/colors";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Task, TaskStatus } from "@prisma/client";
import { useState } from "react";
import { useFormState } from "react-dom";

import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import DoneIcon from "@mui/icons-material/Done";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";

type StatusIconProps = {
  status: TaskStatus;
  icon: JSX.Element;
};

const icons: StatusIconProps[] = [
  {
    status: "TODO",
    icon: <AppRegistrationIcon fontSize="large" color="primary" />,
  },
  {
    status: "DOING",
    icon: <DoubleArrowIcon fontSize="large" color="warning" />,
  },
  { status: "DONE", icon: <DoneIcon fontSize="large" color="action" /> },
];

export default function TaskForm({
  task,
  handleCloseForm,
}: {
  task: Task | null;
  handleCloseForm: () => void;
}) {
  const [title, setTitle] = useState(task?.title);
  const [description, setDescription] = useState(task?.description);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>(
    task ? task.status : "TODO"
  );

  const [formState, dispatch] = useFormState(
    task ? updateTask : createTask,
    null
  );

  const error = formState?.error;

  return (
    <Box component="div" padding={6}>
      <Box
        component="div"
        borderRadius={4}
        width={700}
        height="calc(100vh - 140px)"
        sx={{ backgroundColor: grey[100] }}
      >
        <Box component="form" action={dispatch} method="POST" padding={2}>
          <Box component="div">
            <Typography variant="h4" marginBottom={4}>
              タスク
            </Typography>
            <Stack padding={4} spacing={2}>
              {task && <input hidden name="id" value={task.id} />}
              <TextField
                name="title"
                label="タイトル"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                error={!!error?.["title"]?.message}
                helperText={error?.["title"]?.message}
              />
              <TextField
                name="description"
                label="内容"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={10}
                multiline
                error={!!error?.["description"]?.message}
                helperText={error?.["description"]?.message}
              />
              <Stack direction="row" spacing={2}>
                {icons.map((entry) => (
                  <Button
                    color="inherit"
                    fullWidth
                    variant={
                      selectedStatus === entry.status ? "contained" : "outlined"
                    }
                    key={entry.status}
                    onClick={() => setSelectedStatus(entry.status)}
                  >
                    <Stack spacing={1} alignItems="center" padding={2}>
                      {entry.icon}
                      <span>{entry.status}</span>
                    </Stack>
                  </Button>
                ))}
                <input
                  type="text"
                  hidden
                  name="status"
                  value={selectedStatus}
                />
              </Stack>
            </Stack>
          </Box>
          <Box component="div" padding={4}>
            <Stack direction="row" spacing={4}>
              <Button
                fullWidth
                variant="outlined"
                color="error"
                sx={{ padding: 1 }}
                onClick={() => handleCloseForm()}
              >
                閉じる
              </Button>
              <Button
                fullWidth
                variant="contained"
                sx={{ padding: 1 }}
                type="submit"
                // onClick={() => handleCloseForm()}
              >
                {task ? "変更を保存" : "保存"}
              </Button>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
