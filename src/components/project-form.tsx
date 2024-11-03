"use client";

import { createProject, updateSelectProject } from "@/actions/project-action";
import { projectValidation } from "@/lib/validation";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CheckBox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Fragment, useState } from "react";
import { useFormState } from "react-dom";

export default function ProjectForm({
  projects,
}: {
  projects: {
    id: string;
    checked: boolean;
    name: string;
    description: string | null;
  }[];
}) {
  const [selectedProject, setSelectedProject] = useState(
    projects.find((project) => project.checked)
  );
  const [open, setOpen] = useState(false);
  const [openCreateProejct, setOpenCreateProject] = useState(false);
  const [lastResult, action] = useFormState(createProject, undefined);
  const [form, fields] = useForm({
    lastResult,

    onValidate({ formData }) {
      return parseWithZod(formData, { schema: projectValidation });
    },
    onSubmit(e, { submission }) {
      if (submission?.status !== "error") {
        handleAutoCloseCreateProject();
      }
    },

    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  function handleClose() {
    setOpen(false);
  }

  function handleAutoCloseCreateProject() {
    console.log("called");
    if (form.status !== "error") {
      setOpenCreateProject(false);
    }
  }

  function handleCloseCreateProject() {
    setOpenCreateProject(false);
  }

  const handleSelectProject = (projectId: string) => {
    setSelectedProject(projects.find((project) => project.id === projectId));
  };

  const handleSubmit = async () => {
    await updateSelectProject(selectedProject?.id ?? "");
  };

  return (
    <Fragment>
      <div
        className="rounded-sm px-1 my-1 mx-2 w-fit cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <Button
          endIcon={<ArrowDropDownIcon fontSize="large" />}
          color="inherit"
          sx={{ fontSize: "1.1em" }}
        >
          {projects.find((project) => project.checked)?.name ??
            "プロジェクトを選択してください"}
        </Button>
      </div>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>プロジェクトを選択</DialogTitle>
        <DialogContent>
          <div>
            <div className="flex justify-end mb-2">
              <Button onClick={() => setOpenCreateProject(true)}>
                新しいプロジェクトを作成
              </Button>
            </div>
            <Typography variant="caption" gutterBottom>
              プロジェクトを切り替えると、作業中のタスクは全て終了になります
            </Typography>
            {projects.length > 0 ? (
              <Stack>
                {projects.map((project) => (
                  <Box component="div" key={project.id}>
                    <FormControlLabel
                      label={project.name}
                      control={
                        <CheckBox
                          name="checked"
                          checked={project.id === selectedProject?.id}
                          onChange={() => handleSelectProject(project.id)}
                        />
                      }
                    />
                    <Typography variant="body2" marginLeft={4} marginBottom={2}>
                      {project.description}
                    </Typography>
                    <Divider />
                  </Box>
                ))}
              </Stack>
            ) : (
              <p>プロジェクトがありません</p>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!selectedProject?.id}
          >
            選択
          </Button>
          <Button variant="outlined" onClick={handleClose}>
            閉じる
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openCreateProejct}
        onClose={handleCloseCreateProject}
        fullWidth
      >
        <DialogTitle>プロジェクトの作成</DialogTitle>
        <Box
          component="form"
          id={form.id}
          onSubmit={form.onSubmit}
          action={action}
          noValidate
        >
          <DialogContent>
            <Stack spacing={3}>
              <TextField
                key={fields.title.key}
                name={fields.title.name}
                required
                label="タイトル"
                error={!!fields.title.errors}
                helperText={fields.title.errors}
              />
              <TextField
                name={fields.description.name}
                key={fields.description.key}
                multiline
                rows={5}
                label="概要"
                error={!!fields.description.errors}
                helperText={fields.description.errors}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" type="submit">
              作成
            </Button>
            <Button variant="outlined" onClick={handleCloseCreateProject}>
              閉じる
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Fragment>
  );
}
