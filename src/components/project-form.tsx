"use client";

import { createProject, updateSelectProject } from "@/actions/project-action";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { useFormState } from "react-dom";

export default function ProjectForm({
  projects,
}: {
  projects: { id: string; checked: boolean; name: string }[];
}) {
  const [selectedProject, setSelectedProject] = useState(
    projects.find((project) => project.checked)
  );
  const [open, setOpen] = useState(false);
  const [openCreateProejct, setOpenCreateProject] = useState(false);
  const [formState, dispatch] = useFormState(createProject, null);

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseCreateProject = () => {
    setOpenCreateProject(false);
  };

  const handleSelectProject = (projectId: string) => {
    setSelectedProject(projects.find((project) => project.id === projectId));
  };

  const handleSubmit = async () => {
    await updateSelectProject(selectedProject?.id ?? "");
  };

  return (
    <>
      <div
        className="rounded-sm px-1 my-1 mx-2 w-fit cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <h3>
          {projects.find((project) => project.checked)?.name ?? "No Project"}
          <ArrowDropDownIcon fontSize="medium" />
        </h3>
      </div>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>プロジェクトを選択</DialogTitle>
        <DialogContent>
          <div>
            <div className="flex justify-end">
              <Button onClick={() => setOpenCreateProject(true)}>
                新しいプロジェクトを作成
              </Button>
            </div>
            {projects.length > 0 ? (
              <ul className="mt-4">
                {projects.map((project) => (
                  <li key={project.id}>
                    <input
                      className="mr-2 cursor-pointer"
                      type="checkbox"
                      name="checked"
                      id="checked"
                      checked={project.id === selectedProject?.id}
                      onChange={() => handleSelectProject(project.id)}
                    />
                    {project.name}
                  </li>
                ))}
              </ul>
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
          <Button
            variant="contained"
            color="success"
            disabled={!selectedProject?.id}
          >
            編集
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
        <Box component="form" action={dispatch}>
          <DialogContent>
            <Stack spacing={3}>
              {formState?.message && (
                <Alert severity="error">{formState.message}</Alert>
              )}
              <TextField
                name="title"
                required
                label="タイトル"
                error={!!formState?.error?.["title"]}
                helperText={formState?.error?.["title"]?.message}
              />
              <TextField
                name="description"
                multiline
                rows={5}
                label="概要"
                error={!!formState?.error?.["description"]}
                helperText={formState?.error?.["description"]?.message}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              type="submit"
              onClick={handleCloseCreateProject}
            >
              作成
            </Button>
            <Button variant="outlined" onClick={handleCloseCreateProject}>
              閉じる
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}
