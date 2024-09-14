"use client";

import { useState } from "react";
import { createTask } from "@/actions/task-action";

import CustomInput from "./custom-input";
import CustomTextarea from "./custom-textarea";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import DoneIcon from "@mui/icons-material/Done";

const icons = {
  "0": <AppRegistrationIcon fontSize="large" color="primary" />,
  "1": <DoubleArrowIcon fontSize="large" color="warning" />,
  "2": <DoneIcon fontSize="large" color="action" />,
};

export default function TaskForm({
  statuses,
}: {
  statuses: { code: string; name: string }[];
}) {
  const [selectedStatus, setSelectedStatus] = useState<string>("0");

  return (
    <div>
      <form action={createTask} className="flex flex-col gap-4">
        <CustomInput name="title" label="Title" placeholder="Title" />
        <CustomTextarea
          name="description"
          label="Description"
          placeholder="Description"
        />
        <div className="flex flex-row gap-2">
          {statuses.map((status) => (
            <div
              key={status.code}
              className={`basis-1/3 p-2 border rounded-md ${
                selectedStatus === status.code
                  ? "bg-gray-300 border-gray-600"
                  : "hover:bg-gray-100"
              } cursor-pointer flex flex-col justify-center items-center`}
              onClick={() => setSelectedStatus(status.code)}
            >
              {icons[status.code as keyof typeof icons]}
              <p className="text-center text-sm text-gray-600 mt-2">
                {status.name}
              </p>
            </div>
          ))}
          <input type="text" hidden name="status" value={selectedStatus} />
        </div>
        <div className="mt-8">
          <button
            className="inline-block bg-blue-500 text-white p-2 rounded-md w-full mt-4"
            type="submit"
          >
            登録
          </button>
        </div>
      </form>
    </div>
  );
}
