import { updataProject } from "@/actions/project-action";
import { projectValidation } from "@/lib/validation";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { Project } from "@prisma/client";
import { useFormState, useFormStatus } from "react-dom";
import HourAndMinutes from "../hour-minute";

function SubmitButton() {
  const status = useFormStatus();
  return (
    <Button type="submit" variant="contained" disabled={status.pending}>
      変更を保存
    </Button>
  );
}

export default function ProjectAccordion({ project }: { project: Project }) {
  const [lastResult, action] = useFormState(updataProject, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: projectValidation });
    },

    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });
  return (
    <form id={form.id} action={action} onSubmit={form.onSubmit} noValidate>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          プロジェクト
        </AccordionSummary>
        <AccordionDetails>
          <label className="text-gray-600 text-sm">
            他のプロジェクトと設定内容は共有されません
          </label>
          <Stack spacing={2}>
            <Divider>概要</Divider>
            <TextField
              name={fields.title.name}
              key={fields.title.key}
              required
              label="タイトル"
              defaultValue={project.title}
              error={!!fields.title.errors}
              helperText={fields.title.errors}
            />
            <TextField
              name={fields.description.name}
              key={fields.description.key}
              multiline
              rows={10}
              label="概要"
              defaultValue={project.description}
              error={!!fields.description.errors}
              helperText={fields.description.errors}
            />
            <Divider>稼働時間(月単位)</Divider>
            <HourAndMinutes
              label="標準"
              hourName={fields.standardWorkHour.name}
              minuteNuame={fields.standardWorkMinute.name}
              hourKey={fields.standardWorkHour.key}
              minuteKey={fields.standardWorkMinute.key}
              defaultHour={project.standardWorkHour}
              defaultMinute={project.standardWorkMinute}
              hourErrors={fields.standardWorkHour.errors}
              minuteErrors={fields.standardWorkMinute.errors}
            />
            <HourAndMinutes
              label="最低"
              hourName={fields.minimumWorkHour.name}
              minuteNuame={fields.minimumWorkMinute.name}
              hourKey={fields.minimumWorkHour.key}
              minuteKey={fields.minimumWorkMinute.key}
              defaultHour={project.minimumWorkHour}
              defaultMinute={project.minimumWorkMinute}
              hourErrors={fields.minimumWorkHour.errors}
              minuteErrors={fields.minimumWorkMinute.errors}
            />
            <HourAndMinutes
              label="最大"
              hourName={fields.maximumWorkHour.name}
              minuteNuame={fields.maximumWorkMinute.name}
              hourKey={fields.maximumWorkHour.key}
              minuteKey={fields.maximumWorkMinute.key}
              defaultHour={project.maximumWorkHour}
              defaultMinute={project.maximumWorkMinute}
              hourErrors={fields.maximumWorkHour.errors}
              minuteErrors={fields.maximumWorkMinute.errors}
            />
          </Stack>
        </AccordionDetails>
        <AccordionActions>
          <SubmitButton />
        </AccordionActions>
      </Accordion>
    </form>
  );
}
