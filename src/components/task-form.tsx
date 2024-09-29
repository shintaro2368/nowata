"use client";

import { createTask } from "@/actions/task-action";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import DoneIcon from "@mui/icons-material/Done";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { TaskStatus } from "@prisma/client";
import { useState } from "react";
import { useFormState } from "react-dom";

type statusIconProps = {
  status: TaskStatus;
  icon: JSX.Element;
};

const icons: statusIconProps[] = [
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

export type TaskFormProp = {
  id: string | undefined;
  title: string | undefined;
  description: string | undefined;
  status: TaskStatus | undefined;
};

export default function TaskForm(task: TaskFormProp) {
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>(
    task.status ? task.status : "TODO"
  );
  const [formState, dispatch] = useFormState(createTask, null);
  const error = formState?.error;
  return (
    <div>
      {formState?.message && (
        <p className="text-red-500 mb-2">{formState.message}</p>
      )}
      <Box component="form" action={dispatch} mt={2}>
        <Stack spacing={3}>
          <TextField
            name="title"
            label="タイトル"
            required
            error={!!error?.["title"]?.message}
            helperText={
              error?.["title"]?.message && (
                <span className="text-red-500">
                  {error?.["title"]?.message}
                </span>
              )
            }
          />
          {/* {error?.["title"]?.message && (
          <span className="text-red-500">{error?.["title"]?.message}</span>
        )} */}
          <TextField
            error={!!error?.["description"]?.message}
            name="description"
            label="内容"
            multiline
            rows={5}
            helperText={
              error?.["description"]?.message && (
                <span className="text-red-500">
                  {error?.["description"]?.message}
                </span>
              )
            }
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
            <input type="text" hidden name="status" value={selectedStatus} />
          </Stack>
          <div className="mt-8">
            <Button type="submit" variant="contained" fullWidth>
              登録
            </Button>
          </div>
        </Stack>
      </Box>
    </div>
  );
}
