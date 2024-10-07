import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

import { updataProject } from "@/actions/project-action";
import { Project } from "@prisma/client";

function SubmitButton() {
  const status = useFormStatus();
  return (
    <Button type="submit" variant="contained" disabled={status.pending}>
      変更を保存
    </Button>
  );
}

export default function ProjectAccordion({ project }: { project: Project }) {
  const [isChanged, setIsChanged] = useState(false);
  const [formState, action] = useFormState(updataProject, null);
  // 保存処理が終了後にはボタンは消すようにするため
  useEffect(() => {
    if (isChanged) {
      setIsChanged(false);
    }
  }, [project]);
  return (
    <form action={action}>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          プロジェクト
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <TextField
              name="title"
              required
              label="タイトル"
              defaultValue={project.title}
              error={!!formState?.error?.["title"]?.message}
              helperText={formState?.error?.["title"]?.message}
              onChange={(e) => {
                if (!isChanged) {
                  setIsChanged(true);
                }
              }}
            />
            <TextField
              name="description"
              multiline
              rows={10}
              label="概要"
              defaultValue={project.description}
              error={!!formState?.error?.["description"]?.message}
              helperText={formState?.error?.["description"]?.message}
              onChange={(e) => {
                if (!isChanged) {
                  setIsChanged(true);
                }
              }}
            />
          </Stack>
        </AccordionDetails>
        <AccordionActions>{isChanged && <SubmitButton />}</AccordionActions>
      </Accordion>
    </form>
  );
}
