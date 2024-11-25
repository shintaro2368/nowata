import { create, doneSubTask } from "@/actions/subTask-action";
import { subTaksValidation } from "@/lib/validation";
import { editTaskAtom } from "@/state";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CheckBox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useAtomValue } from "jotai";
import { useFormState } from "react-dom";

export default function SubTaskForm() {
  const editTaskValue = useAtomValue(editTaskAtom);
  const [lastResult, action] = useFormState(create, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate: ({ formData }) => {
      return parseWithZod(formData, { schema: subTaksValidation });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        サブタスク
      </AccordionSummary>
      <AccordionDetails>
        <Box
          component="form"
          id={form.id}
          action={action}
          onSubmit={form.onSubmit}
          noValidate
        >
          <input
            type="hidden"
            name={fields.id.name}
            key={fields.id.key}
            value={editTaskValue?.id}
          />
          <TextField
            name={fields.description.name}
            key={fields.description.key}
            multiline
            rows={2}
            className="w-full"
            error={!!fields.description.errors}
            helperText={fields.description.errors}
          />
          <Box component="div" className="flex justify-end mt-2">
            <Button type="submit" variant="contained" className="mb-2">
              追加
            </Button>
          </Box>
          {editTaskValue?.SubTask.map((subTask) => (
            <Box
              key={subTask.id}
              component="div"
              className="flex items-center border-b"
            >
              <CheckBox
                defaultChecked={subTask.done}
                title="完了にする"
                disabled={subTask.done}
                onChange={async () => {
                  await doneSubTask(subTask.id);
                }}
              />
              <Box>
                <Typography
                  align="left"
                  color={subTask.done ? "gray" : "inherit"}
                >
                  {subTask.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
