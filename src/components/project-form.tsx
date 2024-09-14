"use client";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { updateSelectProject } from "@/actions/project-action";

export default function ProjectForm({
  projects,
}: {
  projects: { id: string; checked: boolean; name: string }[];
}) {
  const [selectedProject, setSelectedProject] = useState(
    projects.find((project) => project.checked)
  );
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleClose = () => {
    setOpen(false);
  };

  const handleRouteProjects = () => {
    handleClose();
    router.push("/projects");
  };

  const handleSelectProject = (projectId: string) => {
    setSelectedProject(projects.find((project) => project.id === projectId));
  };

  const handleSubmit = async () => {
    await updateSelectProject(selectedProject?.id ?? "");
    handleClose();
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
          {projects.length > 0 ? (
            <div>
              <div
                className="text-sm font-medium text-blue-600 text-right cursor-pointer"
                onClick={handleRouteProjects}
              >
                新しいプロジェクトを作成
              </div>
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
            </div>
          ) : (
            <p>プロジェクトがありません</p>
          )}
        </DialogContent>
        <DialogActions>
          <button onClick={handleSubmit}>選択</button>
          <button onClick={handleClose}>閉じる</button>
        </DialogActions>
      </Dialog>
    </>
  );
}
