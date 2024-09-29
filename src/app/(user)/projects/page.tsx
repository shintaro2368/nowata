"use client";

import { createProject } from "@/actions/project-action";
import TextField from "@mui/material/TextField";
import { useFormState } from "react-dom";

export default function Projects() {
  const [formState, dispatch] = useFormState(createProject, null);
  return (
    <div>
      <h1>Projects</h1>
      <form action={dispatch}>
        <TextField name="title" required label="プロジェクト名" />
        <TextField name="description" multiline rows={5} label="説明" />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
