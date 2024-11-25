import { createTask } from "@/actions/task-action";
import { taskValidation } from "@/lib/validation";
import { displayTaskFormAtom, editTaskAtom } from "@/state";
import { useForm, useInputControl } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import DoneIcon from "@mui/icons-material/Done";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers";
import { TaskStatus } from "@prisma/client";
import { useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";
import { useFormState } from "react-dom";
import DatePickerProvider from "../date-picker-provider";
import SubTaskForm from "./sub-task-form";

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

export default function TaskForm() {
  const editTaskValue = useAtomValue(editTaskAtom);
  const setDisplayTaskFrom = useSetAtom(displayTaskFormAtom);
  const [lastResult, action] = useFormState(createTask, undefined);

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      const r = parseWithZod(formData, { schema: taskValidation });
      console.warn(r);
      return r;
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });
  const dueDate = useInputControl(fields.dueDate);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>("TODO");

  return (
    <Box component="div">
      <Box
        component="div"
        borderRadius={4}
        height="auto"
        sx={{ backgroundColor: "white" }}
      >
        <Box
          component="form"
          id={form.id}
          onSubmit={form.onSubmit}
          action={action}
          padding={2}
          noValidate
        >
          <Box component="div">
            <Typography variant="h4" marginBottom={4}>
              タスク
            </Typography>
            <Stack padding={4} spacing={2}>
              {editTaskValue && (
                <input hidden name="id" value={editTaskValue.id} />
              )}
              <TextField
                name={fields.title.name}
                key={fields.description.key}
                label="タイトル"
                defaultValue={fields.title.initialValue}
                error={!!fields.title.errors}
                helperText={fields.title.errors}
              />
              <TextField
                name={fields.description.name}
                key={fields.description.key}
                label="内容"
                defaultValue={fields.description.initialValue}
                rows={10}
                multiline
                error={!!fields.description.errors}
                helperText={fields.description.errors}
              />
              <Stack direction="row" spacing={2}>
                {icons.map((entry) => (
                  <Button
                    color="inherit"
                    sx={{
                      border: 1,
                      borderColor: "rgba(0, 0, 0, 0.23)",
                    }}
                    fullWidth
                    variant={
                      selectedStatus === entry.status ? "contained" : "outlined"
                    }
                    key={entry.status}
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
                  name={fields.status.name}
                  key={fields.status.key}
                  value={selectedStatus}
                />
              </Stack>
              <DatePickerProvider>
                <DatePicker
                  label="期日"
                  name={fields.dueDate.name}
                  key={fields.dueDate.key}
                  slotProps={{
                    textField: {
                      error: !!fields.dueDate.errors,
                      helperText: fields.dueDate.errors,
                    },
                  }}
                />
              </DatePickerProvider>
            </Stack>
          </Box>
          <Box component="div" padding={4}>
            <Stack direction="row" spacing={4}>
              {/* <Button
                fullWidth
                variant="outlined"
                color="error"
                sx={{ padding: 1 }}
                onClick={() => setDisplayTaskFrom(false)}
              >
                閉じる
              </Button> */}
              <Button
                fullWidth
                variant="contained"
                sx={{ padding: 1 }}
                type="submit"
                // onClick={() => handleCloseForm()}
              >
                {editTaskValue ? "変更を保存" : "保存"}
              </Button>
            </Stack>
          </Box>
        </Box>
        <Box padding={2}>{editTaskValue && <SubTaskForm />}</Box>
      </Box>
    </Box>
  );
}
