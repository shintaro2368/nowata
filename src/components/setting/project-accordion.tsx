import { updataProject } from "@/actions/project-action";
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
  const [formState, action] = useFormState(updataProject, null);
  console.warn(project);
  return (
    <form action={action}>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          プロジェクト
        </AccordionSummary>
        <AccordionDetails>
          <label className="text-gray-600 text-sm">他のプロジェクトと設定内容は共有されません</label>
          <Stack spacing={2}>
            <Divider>概要</Divider>
            <TextField
              name="title"
              required
              label="タイトル"
              defaultValue={project.title}
              error={!!formState?.error?.["title"]?.message}
              helperText={formState?.error?.["title"]?.message}
            />
            <TextField
              name="description"
              multiline
              rows={10}
              label="概要"
              defaultValue={project.description}
              error={!!formState?.error?.["description"]?.message}
              helperText={formState?.error?.["description"]?.message}
            />
            <Divider>稼働時間(月単位)</Divider>
            <HourAndMinutes
              label="標準"
              hourName="standardWorkHour"
              minuteNuame="standardWorkMinute"
              defaultHour={project.standardWorkHour}
              defaultMinute={project.standardWorkMinute}
            />
            <HourAndMinutes
              label="最低"
              hourName="minimumWorkHour"
              minuteNuame="minimumWorkMinute"
              defaultHour={project.minimumWorkHour}
              defaultMinute={project.minimumWorkMinute}
            />
            <HourAndMinutes
              label="最大"
              hourName="maximumWorkHour"
              minuteNuame="maximumWorkMinute"
              defaultHour={project.maximumWorkHour}
              defaultMinute={project.maximumWorkMinute}
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
