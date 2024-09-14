"use client";

import CustomInput from "@/components/custom-input";
import CustomTextarea from "@/components/custom-textarea";
import { createProject } from "@/actions/project-action";

export default function Projects() {
  return (
    <div>
      <h1>Projects</h1>
      <form action={createProject}>
        <CustomInput label="Title" name="title" placeholder="Title" />
        <CustomTextarea
          label="Description"
          name="description"
          placeholder="Description"
        />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
