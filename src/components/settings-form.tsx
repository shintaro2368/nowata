"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { Project, Setting } from "@prisma/client";
import { User } from "next-auth";
import { Fragment } from "react";

import ProjectAccordion from "./setting/project-accordion";
import WorkAccordion from "./setting/work-accordion";

export type SettingFormProps = {
  user: User;
  project: Project;
  setting: Setting;
};

export default function SettingsForm({
  settingFormProps,
}: {
  settingFormProps: SettingFormProps;
}) {
  const { user, project, setting } = settingFormProps;

  return (
    <Fragment>
      <Box width="fit-content">
        <Stack spacing={2} width={900} padding={2}>
          <ProjectAccordion project={project} />
          <WorkAccordion setting={setting} />
        </Stack>
      </Box>
    </Fragment>
  );
}
