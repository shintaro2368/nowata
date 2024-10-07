"use client";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { Project, Setting } from "@prisma/client";
import { User } from "next-auth";
import { Fragment } from "react";
import Box from "@mui/material/Box"
import grey from "@mui/material/colors/grey"

import ProjectAccordion from "./setting/project-accordion";
import WorkAccordion from "./setting/work-accordion";

export type SettingFormProps = {
  user: User;
  project: Project;
  setting: Setting,
};

export default function SettingsForm({
  settingFormProps,
}: {
  settingFormProps: SettingFormProps;
}) {
  const { user, project, setting } = settingFormProps;

  return (
    <Fragment>
      <Box bgcolor={grey[200]} width="fit-content" borderRadius={2} margin={1}>
        <Stack spacing={2} width={900} padding={2}>
          <ProjectAccordion project={project} />
          <WorkAccordion setting={setting}/>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              アカウント
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <TextField
                  label="お名前"
                  disabled
                  variant="outlined"
                  value={user.name}
                />
                <TextField label="メールアドレス" disabled value={user.email} />
              </Stack>
            </AccordionDetails>
            <AccordionActions>
              <Button variant="contained" color="error">
                アカウント削除
              </Button>
            </AccordionActions>
          </Accordion>
        </Stack>
      </Box>
    </Fragment>
  );
}
